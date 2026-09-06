import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { JournalEntry, ReflectionData } from "../types";
import { 
  DEMO_USER_ID, 
  getDemoSessionEntries, 
  saveDemoSessionEntry, 
  deleteDemoSessionEntry 
} from "./demoData";

const ENTRIES_COLLECTION = "entries";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function saveEntry(
  uid: string,
  content: string,
  reflection: ReflectionData
): Promise<JournalEntry> {
  const entryPayload = {
    uid,
    content,
    createdAt: new Date().toISOString(),
    summary: reflection.summary,
    emotions: reflection.emotions,
    themes: reflection.themes,
    observations: reflection.observations,
    possiblePatterns: reflection.possible_patterns,
    reflectionQuestion: reflection.reflection_question,
    encouragement: reflection.encouragement,
  };

  if (uid === DEMO_USER_ID) {
    const demoEntry: JournalEntry = {
      id: `demo_session_${Date.now()}`,
      ...entryPayload,
    };
    saveDemoSessionEntry(demoEntry);
    return demoEntry;
  }

  try {
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), entryPayload);
    return {
      id: docRef.id,
      ...entryPayload,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ENTRIES_COLLECTION);
  }
}

export async function fetchUserEntries(uid: string): Promise<JournalEntry[]> {
  if (uid === DEMO_USER_ID) {
    const demoEntries = getDemoSessionEntries();
    return [...demoEntries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where("uid", "==", uid)
    );

    const snapshot = await getDocs(q);
    const entries: JournalEntry[] = [];

    snapshot.forEach((d) => {
      const data = d.data();
      entries.push({
        id: d.id,
        uid: data.uid,
        content: data.content,
        createdAt: data.createdAt,
        summary: data.summary || "",
        emotions: data.emotions || [],
        themes: data.themes || [],
        observations: data.observations || [],
        possiblePatterns: data.possiblePatterns || [],
        reflectionQuestion: data.reflectionQuestion || "",
        encouragement: data.encouragement || "",
      });
    });

    // Client-side sort descending by date
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return entries;
  } catch (error) {
    console.error("Failed to fetch user entries from Firestore:", error);
    handleFirestoreError(error, OperationType.LIST, ENTRIES_COLLECTION);
  }
}

export async function deleteEntry(entryId: string, uid?: string): Promise<{ wasProtected?: boolean }> {
  if (uid === DEMO_USER_ID) {
    const { wasBaseline } = deleteDemoSessionEntry(entryId);
    return { wasProtected: wasBaseline };
  }
  const entryRef = doc(db, ENTRIES_COLLECTION, entryId);
  try {
    await deleteDoc(entryRef);
    return { wasProtected: false };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ENTRIES_COLLECTION}/${entryId}`);
  }
}


// Sample dataset designed specifically for the Ideathon judges to test pattern discovery immediately
export async function seedDemoEntries(uid: string): Promise<JournalEntry[]> {
  const samples = [
    {
      uid,
      content: "I spent almost four hours today tweaking the architecture diagram for the new project pitch. Deep down I know the technical plan is solid, but I kept convincing myself that one more revision would make it impenetrable. Every time I get close to presenting my ideas to leadership, I find something trivial to perfect instead of actually booking the presentation.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days ago
      summary: "You spent excessive time refining a presentation to delay the vulnerability of presenting to leadership.",
      emotions: [
        { name: "Anxiety", intensity: 8 },
        { name: "Perfectionism", intensity: 9 },
        { name: "Ambition", intensity: 6 }
      ],
      themes: ["Decision-making", "Procrastination", "Career Ambition", "Fear of Judgment"],
      observations: [
        "Perfectionism is serving as an emotional shield against potential rejection.",
        "You equated the quality of the slides with your worth as a builder."
      ],
      possiblePatterns: [
        "Analysis before action: Over-indexing on preparation when stakes feel personally meaningful."
      ],
      reflectionQuestion: "Are you trying to make the presentation perfect, or are you trying to protect yourself from criticism?",
      encouragement: "The insight in your idea is what matters most; perfection is just an endless delaying tactic."
    },
    {
      uid,
      content: "Another late night at the desk. Sarah asked me to join the team dinner, but I declined saying I had too much backlog. In reality, I worked at half capacity because my brain was completely fried. I have this stubborn belief that if I'm not physically sitting at the screen, I'm falling behind. I want to build great things, but this pacing is unsustainable.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(), // 9 days ago
      summary: "You sacrificed team social connection for unproductive late-night work driven by fear of falling behind.",
      emotions: [
        { name: "Exhaustion", intensity: 8 },
        { name: "Guilt", intensity: 7 },
        { name: "Isolation", intensity: 6 }
      ],
      themes: ["Burnout", "Work-Life Boundaries", "Relationships", "Self-Worth"],
      observations: [
        "You treat rest as something that must be earned rather than a biological requirement.",
        "Declining social interaction created a compounding sense of isolation."
      ],
      possiblePatterns: [
        "Equating screen time with productivity, especially when feeling depleted."
      ],
      reflectionQuestion: "What would happen if you allowed yourself to stop before you were completely empty?",
      encouragement: "Rest is not a reward for finished work; it is the prerequisite for clear thinking."
    },
    {
      uid,
      content: "Decided to send the prototype to beta users today without the two extra features I thought were mandatory. My heart was pounding when I pressed send, but within an hour we had our first constructive feedback. It wasn't nearly as catastrophic as I envisioned. I'm starting to realize that momentum beats agonizing over hypothetical flaws.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      summary: "You took a decisive leap by releasing an imperfect prototype and discovered that feedback is clarifying rather than threatening.",
      emotions: [
        { name: "Relief", intensity: 9 },
        { name: "Excitement", intensity: 8 },
        { name: "Vulnerability", intensity: 6 }
      ],
      themes: ["Decision-making", "Growth", "Courage", "Action over Analysis"],
      observations: [
        "A noticeable shift toward iterative action rather than defensive delay.",
        "Direct reality provided relief from internal catastrophic predictions."
      ],
      possiblePatterns: [
        "Experiencing genuine confidence when choosing action over rumination."
      ],
      reflectionQuestion: "How can you make this bias toward action your default response to uncertainty?",
      encouragement: "You proved to yourself that you can withstand real feedback and thrive through it."
    }
  ];

  const createdEntries: JournalEntry[] = [];
  for (const s of samples) {
    try {
      const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), s);
      createdEntries.push({ id: docRef.id, ...s });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ENTRIES_COLLECTION);
    }
  }

  return createdEntries;
}
