import { JournalEntry, ChatMessage } from "../types";

export const DEMO_USER_ID = "echo-demo-judge-uid-apac2026";

export const DEMO_USER_PROFILE = {
  uid: DEMO_USER_ID,
  email: "demo.judge@echojournal.internal",
  displayName: "Demo Judge",
  isDemo: true,
};

// 10 authentic, deeply nuanced journal entries spanning 4 weeks
export const INITIAL_DEMO_ENTRIES: JournalEntry[] = [
  {
    id: "demo_entry_10",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    content: `Finished the final dry run of my leadership pitch today. Maya listened carefully to the presentation and told me afterwards: 'You sound like someone who finally knows who they are.' 

Looking back at where I was four weeks ago—frozen over a blank questionnaire, drowning in Notion reorganization, unable to say no to trivial requests—I barely recognize that mindset. The challenges ahead haven't disappeared, and the panel interview tomorrow is still intimidating. But I've learned that hesitation doesn't mean I'm incapable; it just means something matters to me deeply. I am ready for tomorrow.`,
    summary: "A powerful moment of integrated growth, recognizing that hesitation signals deep personal significance rather than incompetence.",
    emotions: [
      { name: "Pride", intensity: 9 },
      { name: "Gratitude", intensity: 9 },
      { name: "Clarity", intensity: 8 }
    ],
    themes: ["Confidence", "Decision-making", "Personal Growth", "Ambition"],
    observations: [
      "Consolidation of weeks of behavioral shifts: decisive action, respectful boundaries, and authentic voice.",
      "Reframing vulnerability as evidence of caring deeply rather than a sign of weakness."
    ],
    possiblePatterns: [
      "Sustained transition from defensive perfectionism toward grounded, proactive leadership."
    ],
    reflectionQuestion: "How will you carry this hard-won clarity forward to support others when you lead the team?",
    encouragement: "You have proven that self-awareness paired with courageous action transforms how you show up in the world."
  },
  {
    id: "demo_entry_9",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    content: `Spent the morning preparing my presentation deck for the upcoming interview. When I hit a tricky section regarding cross-functional engineering friction, the familiar urge crept up: pause, open Twitter, or go clean the kitchen counters. 

But this time, I noticed it happening in real time. I literally stopped and said aloud: 'You're feeling uncertain about this slide, and that's okay. Just write down the honest truth of how you'd handle it.' Within twenty minutes, the slide was finished. Catching the avoidance at the trigger point instead of waking up hours later in regret feels like night and day.`,
    summary: "You demonstrated metacognitive awareness by catching procrastination at the point of origin and responding with self-compassion and focus.",
    emotions: [
      { name: "Focus", intensity: 7 },
      { name: "Patience", intensity: 7 },
      { name: "Self-compassion", intensity: 8 }
    ],
    themes: ["Stress", "Uncertainty", "Personal Growth", "Decision-making"],
    observations: [
      "High self-awareness: recognizing the emotional trigger (uncertainty) before it converts into avoidance behavior.",
      "Replacing self-reproach with gentle self-coaching enabled steady execution."
    ],
    possiblePatterns: [
      "Transforming the relationship with uncertainty from avoidance to curious problem-solving."
    ],
    reflectionQuestion: "How can you cultivate this gentle inner dialogue as your permanent default when challenges arise?",
    encouragement: "Observing your own patterns without judgment is the exact foundation of lasting personal growth."
  },
  {
    id: "demo_entry_8",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    content: `Director David emailed me at noon: they reviewed my leadership application and scheduled my panel interview for next week. 

Two weeks ago, an email like this would have triggered a spiral of imposter syndrome. But today, reading it, my first thought wasn't 'How do I fool them into thinking I'm competent?' It was 'I actually have strong thoughts on how we can structure the team's engineering velocity, and I want to share them.' It feels strange to notice this shift in myself. I'm still nervous, but it's an expansive kind of nervous, not a shrinking one.`,
    summary: "Receiving an interview invitation prompted an empowering shift from imposter anxiety to authentic enthusiasm for contribution.",
    emotions: [
      { name: "Excitement", intensity: 8 },
      { name: "Nervousness", intensity: 5 },
      { name: "Groundedness", intensity: 8 }
    ],
    themes: ["Personal Growth", "Ambition", "Confidence"],
    observations: [
      "A visible perspective shift: moving from self-protection to collaborative contribution.",
      "Reframing nerves from a warning sign of inadequacy into positive energy for engagement."
    ],
    possiblePatterns: [
      "Evolving from defensive self-monitoring toward purpose-driven self-expression."
    ],
    reflectionQuestion: "What happens when you focus on what the team needs rather than how you will be evaluated?",
    encouragement: "You are stepping into rooms not to prove you belong, but to contribute what only you can bring."
  },
  {
    id: "demo_entry_7",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
    content: `Mark approached me again this morning asking if I could compile the monthly metrics deck for his team sync. In the past, I would have said yes without pausing and suffered through another midnight session. 

Today, I took a deliberate breath, smiled, and said: 'I won't be able to take that on this week, Mark—my plate is committed to the Q3 deliverables, but I can share my spreadsheet template with you.' 

He simply said: 'Totally understand, thanks for the template!' That was it! No drama, no bridge burned, no anger. I spent the afternoon actually focusing on my own work with a calm mind.`,
    summary: "You successfully executed a respectful and firm boundary with a coworker and discovered that healthy boundaries are met with understanding.",
    emotions: [
      { name: "Apprehension", intensity: 6 },
      { name: "Pride", intensity: 8 },
      { name: "Calm", intensity: 7 }
    ],
    themes: ["Relationships", "Personal Boundaries", "Confidence"],
    observations: [
      "Your catastrophic prediction about saying 'no' proved completely unfounded.",
      "Protecting your schedule directly restored your cognitive focus."
    ],
    possiblePatterns: [
      "Assertiveness producing immediate peace of mind rather than social conflict."
    ],
    reflectionQuestion: "What other obligations are you carrying that could be dissolved with a simple, courteous boundary?",
    encouragement: "Dignified boundaries do not repel people; they teach people how to collaborate with you sustainably."
  },
  {
    id: "demo_entry_6",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(), // 11 days ago
    content: `I finally submitted the leadership application at 11:15 PM. No extra revisions. 

Maya sat next to me on the sofa, put her hand over my trackpad, and gently said, 'Press submit. You've earned this, stop torturing yourself.' My thumb was literally trembling when I clicked it. 

The moment the confirmation modal showed up, the sky didn't fall. My heart rate slowed down. Even if I don't get the interview, just knowing I didn't let the deadline slip past without trying feels like a victory against my own worst habits.`,
    summary: "With supportive accountability, you overcame intense perfectionist friction to submit your leadership application.",
    emotions: [
      { name: "Anxiety", intensity: 8 },
      { name: "Relief", intensity: 7 },
      { name: "Courage", intensity: 6 }
    ],
    themes: ["Stress", "Confidence", "Decision-making", "Ambition"],
    observations: [
      "External accountability helped interrupt your internal self-sabotage loop.",
      "The emotional catastrophe anticipated before taking action did not materialize."
    ],
    possiblePatterns: [
      "Relief and clarity consistently arriving immediately after taking action on avoided decisions."
    ],
    reflectionQuestion: "How can you build moments of external accountability into your creative process sooner?",
    encouragement: "You broke the hesitation loop. Remember this feeling of calm agency the next time resistance surfaces."
  },
  {
    id: "demo_entry_5",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    content: `Friday evening. Sitting at the kitchen counter looking at the blank submission window for the team lead application. Deadline is midnight next Tuesday. 

I opened the file, wrote three sentences, then deleted all three because they sounded 'too rehearsed'. Then I wrote two more and deleted them because they sounded 'too casual'. 

Why do I do this? Why does every sentence feel like it has to carry the definitive verdict on my capability? I shut the lid again. I'm running out of days to keep hesitating.`,
    summary: "Hyper-critical self-editing paralyzed your ability to complete an application whose deadline is rapidly approaching.",
    emotions: [
      { name: "Restlessness", intensity: 8 },
      { name: "Perfectionism", intensity: 8 },
      { name: "Self-criticism", intensity: 7 }
    ],
    themes: ["Ambition", "Procrastination", "Decision-making"],
    observations: [
      "You are treating the initial drafting stage with the scrutiny appropriate only for a final audit.",
      "You fear being seen through raw, imperfect drafts."
    ],
    possiblePatterns: [
      "All-or-nothing perfectionism paralyzing execution as deadlines draw near."
    ],
    reflectionQuestion: "Can you write an intentionally unpolished draft whose only requirement is that it is finished?",
    encouragement: "You don't have to write a masterpiece in the first pass; you just have to give yourself clay to shape."
  },
  {
    id: "demo_entry_4",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(), // 17 days ago
    content: `Had a long coffee chat with Priya today. She brought up how much she changed career paths in her early thirties and told me that nobody actually feels 'ready' before jumping. 

I tried to nod along, but my default instinct is always to demand 95% statistical certainty before taking any leap. I kept thinking: what if my desire for certainty is just a polite word for cowardice? I wrote down a sentence in my pocket notebook: 'Certainty is an illusion you buy with stagnation.' Still digesting that.`,
    summary: "A discussion about life transitions challenged your reliance on absolute certainty as a prerequisite for meaningful change.",
    emotions: [
      { name: "Doubt", intensity: 7 },
      { name: "Curiosity", intensity: 6 },
      { name: "Hope", intensity: 5 }
    ],
    themes: ["Uncertainty", "Confidence", "Personal Growth"],
    observations: [
      "You recognize that demanding excessive certainty has stalled your momentum.",
      "You are beginning to distinguish prudence from protective paralysis."
    ],
    possiblePatterns: [
      "Equating safety with inaction during periods of transition."
    ],
    reflectionQuestion: "What is one decision you would make today if you accepted that 60% clarity was enough?",
    encouragement: "Clarity doesn't precede the walk; it's generated by taking the first steps down the road."
  },
  {
    id: "demo_entry_3",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    content: `Mark asked me to take over the client demo on Thursday because he was double-booked. Even though my own schedule was already bursting, I said 'Sure, no problem!' before I even checked my calendar. 

Ten seconds later, I felt an immediate wave of irritation at him for asking and at myself for yielding. I have this reflexive need to be the reliable one who never causes friction. 

In the evening, I was quiet and irritable during dinner with Maya, and she asked what was wrong. I couldn't even explain it without sounding petty.`,
    summary: "An automatic impulse to appease a colleague led to boundary erosion, followed by displaced tension in your personal relationship.",
    emotions: [
      { name: "Resentment", intensity: 6 },
      { name: "Guilt", intensity: 8 },
      { name: "Fatigue", intensity: 7 }
    ],
    themes: ["Relationships", "Stress", "Personal Boundaries"],
    observations: [
      "You prioritize immediate peacekeeping over your actual capacity.",
      "Suppressed boundary frustration leaked outward into your evening with Maya."
    ],
    possiblePatterns: [
      "Reflexive compliance: Saying yes out of habit, followed by quiet resentment toward the requester."
    ],
    reflectionQuestion: "Whose disappointment are you more afraid of—a colleague receiving a polite 'no', or yourself burning out?",
    encouragement: "Setting a clear boundary isn't a confrontation; it's the kindest way to preserve mutual respect."
  },
  {
    id: "demo_entry_2",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 24).toISOString(), // 24 days ago
    content: `I spent almost four hours today reorganizing my Notion workspace and color-coding project tags instead of finishing the quarterly roadmap. 

I knew exactly what needed to be written on slide three, but I convinced myself that without a pristine file structure, my thinking wouldn't be rigorous enough. It's ridiculous how productive I can look while completely avoiding the one task that actually matters. 

By 4 PM I was exhausted, yet I hadn't made an ounce of real progress on the proposal.`,
    summary: "You engaged in elaborate secondary productivity as an avoidance mechanism to delay committing to the core quarterly roadmap.",
    emotions: [
      { name: "Frustration", intensity: 8 },
      { name: "Avoidance", intensity: 8 },
      { name: "Guilt", intensity: 7 }
    ],
    themes: ["Procrastination", "Decision-making", "Stress"],
    observations: [
      "Organization was utilized as a socially acceptable form of delay.",
      "You conflated cognitive fatigue with productive output."
    ],
    possiblePatterns: [
      "Productive avoidance: Creating complex preparatory rituals when facing high-stakes creative decisions."
    ],
    reflectionQuestion: "What feeling are you protecting yourself from by staying in preparation mode?",
    encouragement: "A messy draft written today teaches you more than a pristine filing system ever will."
  },
  {
    id: "demo_entry_1",
    uid: DEMO_USER_ID,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 28 days ago
    content: `Woke up at 5:30 AM with my mind racing about whether to apply for the team lead position. On paper, it's everything I've said I wanted for the last two years: more influence, higher scope, a chance to mentor. 

But the minute I started filling out the leadership questionnaire, this sudden knot formed in my stomach. I kept rewriting the opening paragraph four times until I closed my laptop in frustration. 

I told myself I just needed a clearer head, but honestly, part of me feels like staying where I am is safer even if I'm quietly outgrowing it.`,
    summary: "You experienced a sharp conflict between your long-term leadership ambitions and an instinctual urge to retreat to the safety of your current comfort zone.",
    emotions: [
      { name: "Anxiety", intensity: 7 },
      { name: "Determination", intensity: 8 },
      { name: "Overwhelm", intensity: 6 }
    ],
    themes: ["Ambition", "Stress", "Career Ambition", "Uncertainty"],
    observations: [
      "You equated drafting the application with an irrevocable commitment.",
      "Your mind framed stepping up as an existential risk rather than an exploratory step."
    ],
    possiblePatterns: [
      "Hesitation at the threshold of earned progression."
    ],
    reflectionQuestion: "Is the discomfort coming from fear of failing as a leader, or fear of actually succeeding and having to sustain that visibility?",
    encouragement: "Wanting to grow and feeling intimidated by growth are allowed to coexist in the same morning."
  }
];

// Pre-seeded multi-turn conversation matching the required narrative
export const INITIAL_DEMO_CONVERSATION: ChatMessage[] = [
  {
    id: "m_demo_1",
    sender: "user",
    text: "Why do I keep delaying this?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "m_demo_2",
    sender: "echo",
    text: "You've mentioned this goal several times across your recent entries. One possible pattern is that you tend to analyze the decision more intensely when the outcome feels personally important to you—like the leadership application or presentation drafts.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12 + 10000).toISOString(),
  },
  {
    id: "m_demo_3",
    sender: "user",
    text: "What makes you think that?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12 + 45000).toISOString(),
  },
  {
    id: "m_demo_4",
    sender: "echo",
    text: "In several of your recent entries, you've described wanting to move forward while simultaneously looking for more certainty before committing. When stakes are low, you execute rapidly; but when an opportunity represents a meaningful leap in your visibility, your mind initiates elaborate preparatory rituals to shield you from vulnerability.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12 + 60000).toISOString(),
  }
];

const DEMO_ENTRIES_STORAGE_KEY = "echo_demo_session_entries";
const DEMO_CHAT_STORAGE_KEY = "echo_demo_session_chat";

export function getDemoSessionEntries(): JournalEntry[] {
  try {
    const raw = sessionStorage.getItem(DEMO_ENTRIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read demo entries from session storage:", e);
  }
  return INITIAL_DEMO_ENTRIES;
}

export function saveDemoSessionEntry(entry: JournalEntry): JournalEntry[] {
  const current = getDemoSessionEntries();
  const updated = [entry, ...current];
  try {
    sessionStorage.setItem(DEMO_ENTRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save demo entry to session storage:", e);
  }
  return updated;
}

export function deleteDemoSessionEntry(entryId: string): { updated: JournalEntry[]; wasBaseline: boolean } {
  const isBaseline = INITIAL_DEMO_ENTRIES.some((e) => e.id === entryId);
  const current = getDemoSessionEntries();
  const updated = current.filter((e) => e.id !== entryId);
  try {
    sessionStorage.setItem(DEMO_ENTRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not update demo entries in session storage:", e);
  }
  return { updated, wasBaseline: isBaseline };
}

export function getDemoSessionConversation(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(DEMO_CHAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read demo chat from session storage:", e);
  }
  return INITIAL_DEMO_CONVERSATION;
}

export function saveDemoSessionConversation(messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(DEMO_CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn("Could not save demo chat to session storage:", e);
  }
}
