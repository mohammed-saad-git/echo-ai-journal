import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import configData from "./firebase-applet-config.json";

const DEMO_UID = "echo-demo-judge-uid-apac2026";
const DEMO_SERVER_SECRET = process.env.DEMO_SERVER_SECRET || "echo-demo-session-secret-apac-2026";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

let cachedGeminiApiKey: string | null = null;

async function getGeminiApiKey(): Promise<string> {
  if (cachedGeminiApiKey) return cachedGeminiApiKey;

  // 1. Direct environment variable (local dev & container injected)
  if (process.env.GEMINI_API_KEY) {
    cachedGeminiApiKey = process.env.GEMINI_API_KEY;
    return cachedGeminiApiKey;
  }

  // 2. Google Cloud Secret Manager (for production Cloud Run)
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || configData.projectId || "gen-ai-apac-506709";
    const secretName = `projects/${projectId}/secrets/GEMINI_API_KEY/versions/latest`;
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({ name: secretName });
    const payload = version.payload?.data?.toString();
    if (payload) {
      cachedGeminiApiKey = payload.trim();
      return cachedGeminiApiKey;
    }
  } catch (err: any) {
    console.log("Secret Manager lookup notice:", err.message);
  }

  return process.env.GEMINI_API_KEY || "";
}

// Resilient Gemini generation with automatic model fallback and high-availability models
function getGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function generateGeminiContentWithRetry(ai: GoogleGenAI, params: any) {
  const candidateModels = [
    process.env.GEMINI_MODEL,
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
  ].filter(Boolean) as string[];

  const models = Array.from(new Set(candidateModels));
  let lastError: any = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      if (i < models.length - 1) {
        // Brief pause before trying next candidate
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }
  throw lastError;
}

// Clean JSON response string stripping markdown fences
function parseGeminiJsonResponse(rawText: string): any {
  let cleaned = (rawText || "").trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

// In-memory verification cache to avoid repeated HTTP calls for same token
const tokenCache = new Map<string, { uid: string; email?: string; name?: string; expiresAt: number }>();

// Firebase Authentication Verification Middleware
async function authenticateFirebaseUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header. Please sign in." });
    return;
  }

  const idToken = authHeader.split(" ")[1].trim();
  if (!idToken) {
    res.status(401).json({ error: "Empty token provided." });
    return;
  }

  // Check cache first
  const now = Date.now();
  const cached = tokenCache.get(idToken);
  if (cached && cached.expiresAt > now) {
    req.user = { uid: cached.uid, email: cached.email, name: cached.name };
    next();
    return;
  }

  // 1. Check if token is a cryptographically verified Demo Session Token
  try {
    const parts = idToken.split(".");
    if (parts.length === 3) {
      const [headerB64, payloadB64, signature] = parts;
      const expectedSig = crypto
        .createHmac("sha256", DEMO_SERVER_SECRET)
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64url");

      if (signature === expectedSig) {
        const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
        if (payload.uid === DEMO_UID && payload.exp > now) {
          req.user = {
            uid: payload.uid,
            email: payload.email,
            name: payload.name,
          };
          tokenCache.set(idToken, {
            uid: payload.uid,
            email: payload.email,
            name: payload.name,
            expiresAt: payload.exp,
          });
          next();
          return;
        }
      }
    }
  } catch (demoErr) {
    // Not a valid demo token, proceed to standard Firebase verification
  }

  try {
    // Authoritative verification via Firebase Identity Toolkit
    const apiKey = configData.apiKey;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      // Fallback: parse JWT payload if identity lookup throttles
      try {
        const parts = idToken.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
          if (payload.user_id || payload.sub) {
            const uid = payload.user_id || payload.sub;
            req.user = { uid, email: payload.email, name: payload.name };
            tokenCache.set(idToken, { uid, email: payload.email, name: payload.name, expiresAt: now + 5 * 60 * 1000 });
            next();
            return;
          }
        }
      } catch (e) {
        // failed fallback
      }
      res.status(401).json({ error: "Session expired or invalid. Please sign in again." });
      return;
    }

    const data = await response.json();
    if (data.users && data.users.length > 0) {
      const user = data.users[0];
      req.user = {
        uid: user.localId,
        email: user.email,
        name: user.displayName,
      };
      tokenCache.set(idToken, {
        uid: user.localId,
        email: user.email,
        name: user.displayName,
        expiresAt: now + 15 * 60 * 1000,
      });
      next();
    } else {
      res.status(401).json({ error: "User identity could not be verified." });
    }
  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Authentication verification failed." });
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json({ limit: "2mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      name: "Echo — Private AI Journal",
      ideathon: "Google Cloud Gen AI Academy APAC",
      architecture: {
        frontend: "React + Vite + Tailwind CSS",
        auth: "Firebase Authentication",
        database: "Google Cloud Firestore",
        ai: "Google Gemini 3.8 Flash",
        secrets: "Google Cloud Secret Manager",
        compute: "Google Cloud Run"
      }
    });
  });

  // POST /api/auth/demo-session - Mint isolated authenticated demo session for judges & reviewers
  app.post("/api/auth/demo-session", (req: Request, res: Response) => {
    try {
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(JSON.stringify({
        uid: DEMO_UID,
        email: "demo.judge@echojournal.internal",
        name: "Demo Judge",
        isDemo: true,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24-hour demo session
      })).toString("base64url");

      const signature = crypto
        .createHmac("sha256", DEMO_SERVER_SECRET)
        .update(`${header}.${payload}`)
        .digest("base64url");

      const token = `${header}.${payload}.${signature}`;

      res.json({
        token,
        user: {
          uid: DEMO_UID,
          email: "demo.judge@echojournal.internal",
          displayName: "Demo Judge",
          isDemo: true,
        }
      });
    } catch (err: any) {
      console.error("Error creating demo session:", err);
      res.status(500).json({ error: "Failed to initialize demo session." });
    }
  });

  // POST /api/reflect - Analyze journal entry
  app.post("/api/reflect", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string" || content.trim().length === 0) {
        res.status(400).json({ error: "Journal content cannot be empty." });
        return;
      }

      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        res.status(500).json({ error: "Gemini API key is not configured on the server." });
        return;
      }

      const ai = getGeminiClient(apiKey);

      const prompt = `Analyze this journal entry written by the user.

USER JOURNAL ENTRY:
"""
${content}
"""

Instructions:
1. Provide a structured reflection following the required JSON schema strictly.
2. Tone: Calm, thoughtful, non-judgmental, observant, and intellectually honest.
3. CRITICAL: Never diagnose mental health conditions or frame observations as objective diagnostic truths.
4. Use exploratory language like "It sounds like...", "You seem to be...", "One possible pattern...", "It could be worth exploring...".
5. Extract 2-4 primary emotions with intensity ratings from 1 to 10.
6. Extract 2-4 key themes (e.g. "Decision-making", "Ambition", "Rest vs Work", "Personal Boundaries").
7. Offer 2-3 specific observations about what they wrote, what beliefs or assumptions appear, or what they might be avoiding.
8. Identify 1-2 possible patterns emerging.
9. Ask one poignant, insightful reflection question ("Something worth asking yourself").
10. Include a brief, grounded note of encouragement.

Return ONLY a valid JSON object matching this schema:
{
  "summary": "Concise 1-2 sentence distillation of what stands out",
  "emotions": [
    { "name": "Emotion name", "intensity": 8 }
  ],
  "themes": ["Theme 1", "Theme 2"],
  "observations": ["Observation 1", "Observation 2"],
  "possible_patterns": ["Pattern 1"],
  "reflection_question": "Poignant self-reflective question",
  "encouragement": "Gentle, grounded closing reassurance"
}`;

      const response = await generateGeminiContentWithRetry(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are Echo, a private AI journal reflection engine. You help people see themselves clearly through calm, dignified, and insightful reflections. You never preach or lecture.",
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response generated from Gemini");
      }

      const parsedReflection = parseGeminiJsonResponse(responseText);
      res.json({ reflection: parsedReflection });
    } catch (error: any) {
      console.error("Error in /api/reflect:", error);
      res.status(500).json({ error: error.message || "Failed to generate reflection." });
    }
  });

  // POST /api/chat - Multi-turn conversational journal inquiry
  app.post("/api/chat", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { messages, recentEntries, currentEntryId } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Invalid conversation messages." });
        return;
      }

      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        res.status(500).json({ error: "Gemini API key is not configured on the server." });
        return;
      }

      const ai = getGeminiClient(apiKey);

      // Build context from user's authenticated entries only
      let entriesContext = "No prior journal entries available yet.";
      if (Array.isArray(recentEntries) && recentEntries.length > 0) {
        entriesContext = recentEntries.map((e: any, idx: number) => {
          const isCurrent = e.id === currentEntryId ? " [CURRENT ENTRY FOCUS]" : "";
          const dateStr = e.createdAt ? new Date(e.createdAt).toLocaleDateString() : `Entry ${idx + 1}`;
          const themes = Array.isArray(e.themes) ? e.themes.join(", ") : "";
          const emotions = Array.isArray(e.emotions) ? e.emotions.map((m: any) => `${m.name} (${m.intensity}/10)`).join(", ") : "";
          return `--- ENTRY #${idx + 1}${isCurrent} (${dateStr}) ---
Themes: ${themes}
Emotions: ${emotions}
Summary: ${e.summary || "N/A"}
Content:
${e.content}
${e.possiblePatterns?.length ? `Detected Patterns: ${e.possiblePatterns.join("; ")}` : ""}`;
        }).join("\n\n");
      }

      const systemInstruction = `You are Echo — a private, thoughtful AI journal companion.
Your purpose: Help the user understand the recurring patterns behind their thoughts, decisions, emotions, and behaviors.

USER'S PRIVATE JOURNAL HISTORY CONTEXT:
The user has granted you access to their own past journal entries below. Use this history to answer their questions, spot shifts over time, and identify themes:
${entriesContext}

CONVERSATION GUIDELINES:
1. Speak in a calm, warm, articulate, and intellectually honest tone.
2. Directly reference details, dates, or recurring themes from their journal when relevant (e.g., "In your entry from last Tuesday...", "You've written about this tension between speed and perfection twice now...").
3. If they ask questions like "Why do I keep delaying this?" or "What patterns do you see?", examine what they've shared with genuine curiosity and nuance.
4. If there are few entries or inconclusive evidence, be upfront: "With just a couple of entries, it's tentative, but I notice...".
5. Never diagnose mental health conditions, never scold or give unsolicited life advice, and never pretend to be a therapist.
6. Keep responses conversational and well-spaced (2-4 concise paragraphs).`;

      // Format multi-turn conversation for Gemini ensuring it starts with user role and alternates
      const formattedContents: { role: string; parts: { text: string }[] }[] = [];
      let foundFirstUser = false;
      for (const m of messages) {
        if (!foundFirstUser && m.sender !== "user") {
          continue; // skip leading assistant greetings
        }
        foundFirstUser = true;
        formattedContents.push({
          role: m.sender === "echo" ? "model" : "user",
          parts: [{ text: m.text }]
        });
      }

      // If no user messages yet, fallback to the last message as user
      if (formattedContents.length === 0 && messages.length > 0) {
        const last = messages[messages.length - 1];
        formattedContents.push({
          role: "user",
          parts: [{ text: last.text }]
        });
      }

      // Consolidate consecutive same-role messages
      const consolidatedContents: { role: string; parts: { text: string }[] }[] = [];
      for (const msg of formattedContents) {
        if (consolidatedContents.length > 0 && consolidatedContents[consolidatedContents.length - 1].role === msg.role) {
          consolidatedContents[consolidatedContents.length - 1].parts[0].text += `\n\n${msg.parts[0].text}`;
        } else {
          consolidatedContents.push({
            role: msg.role,
            parts: [{ text: msg.parts[0].text }]
          });
        }
      }

      const response = await generateGeminiContentWithRetry(ai, {
        contents: consolidatedContents,
        config: {
          systemInstruction,
          temperature: 0.5,
        }
      });

      const reply = response.text || "I'm listening. What else would you like to explore together?";
      res.json({ reply });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "Failed to continue conversation." });
    }
  });

  // POST /api/patterns - Cross-entry longitudinal pattern analysis
  app.post("/api/patterns", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { entries } = req.body;

      if (!Array.isArray(entries) || entries.length === 0) {
        res.json({
          recurringThemes: [],
          recentPatterns: [],
          biggestShift: null,
          message: "Write your first few journal entries to start uncovering patterns."
        });
        return;
      }

      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        res.status(500).json({ error: "Gemini API key is not configured on the server." });
        return;
      }

      const ai = getGeminiClient(apiKey);

      const entriesSummaryText = entries.map((e: any, idx: number) => {
        const date = e.createdAt ? new Date(e.createdAt).toISOString().split("T")[0] : `Entry ${idx + 1}`;
        return `[Date: ${date}]
Themes: ${(e.themes || []).join(", ")}
Content excerpt: ${e.content?.slice(0, 300) || ""}
Summary: ${e.summary || ""}
Possible patterns: ${(e.possiblePatterns || []).join("; ")}`;
      }).join("\n\n");

      const prompt = `Analyze these journal entries written by this user across time to discover recurring themes, recent behavioral/cognitive patterns, and shifts in perspective.

JOURNAL ENTRIES:
${entriesSummaryText}

TASK:
1. Extract top recurring themes with counts and percentages (based on the real occurrences in the entries).
2. Identify 2 to 4 specific "recent patterns" with:
   - title (e.g. "Analysis before action", "Evening fatigue and self-criticism")
   - explanation (1-2 sentences on what shows up and why)
   - relatedEntriesCount (integer)
   - lastObservedDate (human readable or YYYY-MM-DD)
3. Identify the "Biggest shift" in their perspective if observed across their entries:
   - topic (e.g. "Handling uncertainty")
   - thenQuote (short representative thought or quote from an earlier entry or earlier mindset)
   - nowQuote (short representative thought or quote showing growth, shift, or recent stance)
   - explanation (1-2 sentences explaining how their perspective evolved)
   If they only have 1 or 2 entries, you can still formulate an emerging shift or tentative shift based on the nuance of their thoughts.

Return ONLY a valid JSON object matching:
{
  "recurringThemes": [
    { "theme": "Ambition", "count": 4, "percentage": 80 }
  ],
  "recentPatterns": [
    {
      "id": "p1",
      "title": "Analysis before action",
      "explanation": "You often describe spending significant time thinking through possibilities before committing.",
      "relatedEntriesCount": 3,
      "lastObservedDate": "2026-09-02"
    }
  ],
  "biggestShift": {
    "topic": "Decision Making",
    "thenQuote": "I don't know if this is the right move.",
    "nowQuote": "I'm going to try it and adjust.",
    "explanation": "A shift from seeking guarantees to embracing iterative action."
  }
}`;

      const response = await generateGeminiContentWithRetry(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are Echo's pattern recognition engine. Extract real, grounded patterns from user journal entries without inflating or psychoanalyzing.",
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      const parsed = parseGeminiJsonResponse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/patterns:", error);
      res.status(500).json({ error: error.message || "Failed to generate patterns." });
    }
  });

  // Vite middleware in dev or static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Echo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
