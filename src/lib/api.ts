import { auth } from "./firebase";
import { ReflectionData, ChatMessage, PatternsSummary } from "../types";

async function getAuthHeaders(): Promise<HeadersInit> {
  let token = "";
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch {
      token = "";
    }
  } else {
    token = sessionStorage.getItem("echo_demo_auth_token") || "";
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function generateReflection(content: string): Promise<ReflectionData> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/reflect", {
    method: "POST",
    headers,
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.reflection;
}

export async function sendChatMessage(
  messages: { sender: "user" | "echo"; text: string }[],
  recentEntries: any[],
  currentEntryId?: string
): Promise<{ reply: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({ messages, recentEntries, currentEntryId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to receive AI response (${response.status})`);
  }

  return response.json();
}

export async function analyzePatterns(entries: any[]): Promise<PatternsSummary> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/patterns", {
    method: "POST",
    headers,
    body: JSON.stringify({ entries }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to analyze patterns (${response.status})`);
  }

  return response.json();
}
