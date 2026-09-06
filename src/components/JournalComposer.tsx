import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Feather, HelpCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { generateReflection } from "../lib/api";
import { saveEntry } from "../lib/entries";
import { JournalEntry } from "../types";

interface JournalComposerProps {
  onEntrySaved: (entry: JournalEntry) => void;
}

export const JournalComposer: React.FC<JournalComposerProps> = ({ onEntrySaved }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "there";

  // Prompt suggestions
  const prompts = [
    "A decision I keep putting off...",
    "What drained my energy today...",
    "A tension in a relationship I can't quite articulate...",
    "A goal I want, but feel ambivalent about...",
    "Something I was quietly proud of this week..."
  ];

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("echo_journal_draft");
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, []);

  // Save draft on change
  const handleContentChange = (val: string) => {
    setContent(val);
    localStorage.setItem("echo_journal_draft", val);
  };

  // Thinking phases cycling animation
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setThinkingPhase(0);
      interval = setInterval(() => {
        setThinkingPhase((prev) => (prev + 1) % 4);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const thinkingMessages = [
    "Echo is reading through your entry...",
    "Observing underlying emotional undertones...",
    "Synthesizing recurring themes & assumptions...",
    "Crafting your reflection question..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isProcessing) return;
    if (!user) {
      setError("Please sign in to save your reflections.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // 1. Call Gemini backend for structured reflection
      const reflection = await generateReflection(content);

      // 2. Persist to Firestore with authenticated user ID
      const savedEntry = await saveEntry(user.uid, content, reflection);

      // Clear draft
      localStorage.removeItem("echo_journal_draft");
      setContent("");

      // Notify parent to display the reflection
      onEntrySaved(savedEntry);
    } catch (err: any) {
      console.error("Reflection error:", err);
      setError(err.message || "Unable to reflect with Echo at this moment. Your journal text has been safely preserved.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPrompt = (promptText: string) => {
    if (!content.trim()) {
      handleContentChange(promptText + " ");
    } else {
      handleContentChange(content + "\n\n" + promptText + " ");
    }
  };

  const loadSampleThought = () => {
    const sample = `I've been feeling torn about the project roadmap. On one hand, everyone wants to ship the feature fast to impress stakeholders, but on the other hand, the foundational user experience feels half-baked. I caught myself nodding along during the morning sync even though my gut was screaming that we're rushing. Why do I stay quiet when I clearly see the risk? I think I'm worried about being labeled as difficult or slowing down momentum.`;
    handleContentChange(sample);
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {/* Header bar */}
      <header className="border-b border-[#E5E5E0] flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 lg:px-10 py-5 bg-white/60 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1A1A1A] tracking-tight">
            {getGreeting()}, <span className="font-semibold">{firstName}</span>.
          </h1>
          <p className="text-sm text-[#6B6B66] mt-0.5">
            What's on your mind today?
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadSampleThought}
            className="px-4 py-2 text-xs font-medium border border-[#E5E5E0] rounded-full hover:bg-white text-[#6B6B66] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Sample Entry</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] text-[11px] font-semibold text-[#5A5A40]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash Analysis</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-6 lg:mx-10 mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-semibold">Reflection failed</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Two-Column High-Density Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-10 pb-12">
        {/* Left Side: Journal Input (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col">
          {isProcessing ? (
            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-8 sm:p-12 shadow-sm text-center space-y-6 animate-in fade-in duration-300 min-h-[480px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] flex items-center justify-center mx-auto text-[#5A5A40] relative">
                <Sparkles className="w-8 h-8 animate-pulse text-[#5A5A40]" />
                <div className="absolute -inset-1 rounded-full border border-[#5A5A40]/30 animate-ping" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-serif italic font-semibold text-[#1A1A1A]">Echo is listening and reflecting...</h3>
                <p className="text-sm text-[#6B6B66] font-medium h-6 transition-all duration-300">
                  {thinkingMessages[thinkingPhase]}
                </p>
              </div>

              <div className="w-48 h-1.5 bg-[#E5E5E0] rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-[#5A5A40] rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${((thinkingPhase + 1) / 4) * 100}%` }}
                />
              </div>

              <p className="text-xs text-[#A3A38E]">
                Analyzing emotional undertones, assumptions, and recurring behavioral loops.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col bg-white border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden flex-1">
              {/* Draft Status Bar */}
              <div className="p-5 sm:p-6 border-b border-[#F5F5F0] flex justify-between items-center bg-white">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">
                  Draft · Today, {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <span className="text-xs text-[#6B6B66] font-mono">
                  {wordCount} words · {charCount} chars
                </span>
              </div>

              {/* Textarea */}
              <textarea
                id="journal-textarea"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write whatever is on your mind. Don't worry about making it sound good or coherent. Echo looks beneath the surface..."
                rows={12}
                className="w-full flex-1 p-6 sm:p-8 text-base sm:text-lg leading-relaxed text-[#1A1A1A] placeholder:text-[#C4C4BC] bg-transparent border-0 focus:outline-hidden resize-none font-normal"
              />

              {/* Thought Starters inside Composer */}
              <div className="px-6 py-3 bg-[#FBFBF9] border-t border-[#F5F5F0] flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#A3A38E] mr-1">
                  Prompts:
                </span>
                {prompts.slice(0, 3).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPrompt(p)}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-[#F5F5F0] text-[#6B6B66] hover:text-[#1A1A1A] rounded-full transition-colors border border-[#E5E5E0]"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Composer Footer Bar */}
              <div className="p-5 sm:p-6 flex flex-wrap justify-between items-center gap-4 bg-[#FBFBF9] rounded-b-2xl border-t border-[#F5F5F0]">
                <div className="flex items-center gap-2 text-xs text-[#6B6B66]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#A3A38E]" />
                  <span>Private and encrypted in your personal cloud store</span>
                </div>

                <button
                  id="btn-reflect-with-echo"
                  type="submit"
                  disabled={!content.trim() || isProcessing}
                  className={`px-8 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
                    content.trim() && !isProcessing
                      ? "bg-[#5A5A40] text-white hover:bg-[#4A4A30] cursor-pointer"
                      : "bg-[#E5E5E0] text-[#A3A38E] cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-white/90" />
                  <span>Reflect with Echo</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: AI Companion Insights (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live Reflection Preview Card (#5A5A40 deep olive) */}
          <div className="bg-[#5A5A40] text-white rounded-2xl p-6 shadow-lg shadow-[#5A5A40]/15 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold text-white/80">
                Echo Core Insight
              </span>
            </div>

            <h3 className="text-xl font-serif italic mb-3 leading-snug">
              {content.trim().length > 30 
                ? "Writing uncovers what logic alone tries to rationalize."
                : "Echo listens for tension, unspoken feelings, and cognitive habits."}
            </h3>

            <p className="text-sm text-white/80 font-light leading-relaxed mb-6">
              When you submit an entry, Gemini examines emotional layers, recurring assumptions, and prompts reflection questions that guide genuine self-discovery.
            </p>

            {/* Quick Metrics Translucent Tiles */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div className="bg-white/10 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-white/70">Perspective</span>
                <span className="text-sm font-semibold">Unfiltered</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-white/70">Focus</span>
                <span className="text-sm font-semibold">Longitudinal</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-white/70">Model</span>
                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Gemini 3.8 Flash</span>
              </div>
            </div>
          </div>

          {/* Recurring Themes Indicator Card */}
          <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">
                Active Theme Dimensions
              </h4>
              <span className="text-xs text-[#6B6B66]">Synthesized</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#1A1A1A]">Career Ambition vs. Stillness</span>
                  <span className="text-[#6B6B66]">Core Tension</span>
                </div>
                <div className="w-full bg-[#F5F5F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1A1A1A] h-full rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#1A1A1A]">People-pleasing in Syncs</span>
                  <span className="text-[#6B6B66]">Recurring</span>
                </div>
                <div className="w-full bg-[#F5F5F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#5A5A40] h-full rounded-full" style={{ width: "60%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#1A1A1A]">Decisive Action</span>
                  <span className="text-[#6B6B66]">Emerging</span>
                </div>
                <div className="w-full bg-[#F5F5F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#A3A38E] h-full rounded-full" style={{ width: "42%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Prompt card */}
          <div className="bg-[#F5F5F0] border border-[#E5E5E0] rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#A3A38E] block mb-1">
                Reflective Inversion
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-[#1A1A1A] leading-snug">
                "What would you do today if you didn't have to defend your choice to anyone?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
