import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Calendar, 
  FileText, 
  Compass, 
  Loader2, 
  RefreshCw,
  Plus
} from "lucide-react";
import { JournalEntry, PatternsSummary } from "../types";
import { analyzePatterns } from "../lib/api";

interface PatternsViewProps {
  entries: JournalEntry[];
  onSeedDemo: () => Promise<void>;
  onNewEntry: () => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({ 
  entries, 
  onSeedDemo,
  onNewEntry 
}) => {
  const [patterns, setPatterns] = useState<PatternsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchPatterns = async () => {
    if (entries.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePatterns(entries);
      setPatterns(result);
    } catch (err: any) {
      console.error("Patterns error:", err);
      setError(err.message || "Failed to analyze patterns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, [entries.length]);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await onSeedDemo();
    } finally {
      setIsSeeding(false);
    }
  };

  // If user has zero entries or only one entry
  if (entries.length < 2) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E5E5E0] flex items-center justify-center mx-auto text-[#5A5A40] shadow-sm">
          <Compass className="w-8 h-8 text-[#5A5A40]" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight">
            Pattern discovery needs <span className="font-serif italic font-semibold">reflection history</span>
          </h2>
          <p className="text-sm text-[#6B6B66] leading-relaxed">
            Echo connects recurring themes, behavioral loops, and perspective shifts across your entries. You currently have {entries.length} entry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-pattern-write-entry"
            onClick={onNewEntry}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#5A5A40] text-white hover:bg-[#4A4A30] rounded-full text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a journal entry</span>
          </button>
          <button
            id="btn-pattern-seed-demo"
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#F5F5F0] hover:bg-white border border-[#E5E5E0] text-[#1A1A1A] rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#5A5A40]" />}
            <span>Load Ideathon Demo Dataset (3 entries)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] text-xs font-semibold text-[#5A5A40] mb-2">
            <Compass className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Cross-Entry Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#1A1A1A] tracking-tight">
            What keeps <span className="font-serif italic font-semibold">showing up?</span>
          </h1>
          <p className="text-sm text-[#6B6B66] mt-1">
            Echo looks across your journal to surface recurring themes and cognitive patterns.
          </p>
        </div>

        <button
          onClick={fetchPatterns}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-white border border-[#E5E5E0] hover:bg-[#F5F5F0] text-xs font-medium text-[#1A1A1A] flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#5A5A40]" : ""}`} />
          <span>Re-analyze</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-4 bg-white rounded-2xl border border-[#E5E5E0]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#5A5A40]" />
          <p className="text-sm font-medium text-[#6B6B66]">
            Gemini is synthesizing patterns across your {entries.length} entries...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-800">
          <p className="font-semibold">Unable to analyze patterns</p>
          <p className="text-xs mt-1 text-red-700">{error}</p>
        </div>
      ) : patterns ? (
        <div className="space-y-10">
          {/* Section 1: Recurring Themes with Real Bars */}
          {patterns.recurringThemes && patterns.recurringThemes.length > 0 && (
            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">
                  Recurring Themes
                </h3>
                <p className="text-xs text-[#6B6B66] mt-0.5">
                  Frequency of subject matter across your personal entries
                </p>
              </div>

              <div className="space-y-4">
                {patterns.recurringThemes.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1A1A1A]">{item.theme}</span>
                      <span className="text-[#6B6B66] font-mono">
                        {item.count} {item.count === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5F5F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A1A1A] rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(Math.max(item.percentage, 15), 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Recent Patterns Cards */}
          {patterns.recentPatterns && patterns.recentPatterns.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">
                  Recent Patterns
                </h3>
                <p className="text-xs text-[#6B6B66] mt-0.5">
                  Recurring behavioral and cognitive tendencies observed by Gemini
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {patterns.recentPatterns.map((pat) => (
                  <div 
                    key={pat.id || pat.title}
                    className="bg-white border border-[#E5E5E0] rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3 hover:border-[#5A5A40]/40 transition-all"
                  >
                    <div className="space-y-2">
                      <h4 className="font-serif italic font-semibold text-base text-[#1A1A1A] leading-snug">
                        {pat.title}
                      </h4>
                      <p className="text-xs text-[#6B6B66] leading-relaxed">
                        "{pat.explanation}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F5F5F0] flex items-center justify-between text-[11px] text-[#A3A38E]">
                      <span className="flex items-center gap-1 font-medium text-[#5A5A40]">
                        <FileText className="w-3 h-3" />
                        {pat.relatedEntriesCount} related {pat.relatedEntriesCount === 1 ? "entry" : "entries"}
                      </span>
                      {pat.lastObservedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {pat.lastObservedDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Biggest Shift ("Then" vs "Now") */}
          {patterns.biggestShift && (
            <div className="bg-[#F5F5F0] border border-[#E5E5E0] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5A5A40]" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#5A5A40]">
                  Biggest Shift: {patterns.biggestShift.topic}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 items-center">
                {/* Then */}
                <div className="p-4 bg-white border border-[#E5E5E0] rounded-xl space-y-1.5 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#A3A38E] block">
                    Then
                  </span>
                  <p className="font-serif italic text-base text-[#6B6B66]">
                    "{patterns.biggestShift.thenQuote}"
                  </p>
                </div>

                {/* Now */}
                <div className="p-4 bg-white border border-[#5A5A40]/30 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#5A5A40] block">
                    Now
                  </span>
                  <p className="font-serif italic text-base text-[#1A1A1A] font-medium">
                    "{patterns.biggestShift.nowQuote}"
                  </p>
                </div>
              </div>

              {patterns.biggestShift.explanation && (
                <p className="text-xs text-[#6B6B66] leading-relaxed pt-1">
                  {patterns.biggestShift.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
