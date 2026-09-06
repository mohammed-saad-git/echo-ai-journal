import React from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Heart,
  Tag
} from "lucide-react";
import { JournalEntry } from "../types";

interface ReflectionViewProps {
  entry: JournalEntry;
  onContinueInChat: (entry: JournalEntry) => void;
  onWriteAnother: () => void;
  onViewHistory: () => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  entry,
  onContinueInChat,
  onWriteAnother,
  onViewHistory,
}) => {
  const formattedDate = entry.createdAt 
    ? new Date(entry.createdAt).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Today";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4">
        <button
          onClick={onWriteAnother}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6B6B66] hover:text-[#1A1A1A] transition-colors px-3 py-1.5 rounded-full border border-[#E5E5E0] bg-white hover:bg-[#F5F5F0]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Write another entry</span>
        </button>

        <span className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">{formattedDate}</span>
      </div>

      {/* Main Reflection Hero Card in Deep Olive #5A5A40 */}
      <div className="bg-[#5A5A40] text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-[#5A5A40]/15 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-semibold text-white/80">
            Echo Reflection
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-light text-white/90 mb-2">
          What stands out
        </h1>
        <p className="font-serif italic text-2xl sm:text-3xl text-white leading-relaxed mb-6">
          "{entry.summary}"
        </p>

        {/* Emotions Gauges Inside High Density Hero */}
        {entry.emotions && entry.emotions.length > 0 && (
          <div className="border-t border-white/15 pt-5 space-y-3">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-white/70 block">
              Emotional Resonance
            </span>
            <div className="grid sm:grid-cols-3 gap-3">
              {entry.emotions.map((emo, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl space-y-2 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{emo.name}</span>
                    <span className="text-xs font-mono text-white/80">{emo.intensity}/10</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(emo.intensity * 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Themes Tags */}
      {entry.themes && entry.themes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E] flex items-center gap-1.5 mr-1">
            <Tag className="w-3.5 h-3.5" />
            Themes:
          </span>
          {entry.themes.map((theme, idx) => (
            <span 
              key={idx} 
              className="px-3.5 py-1 rounded-full bg-white border border-[#E5E5E0] text-xs font-medium text-[#1A1A1A] shadow-2xs"
            >
              {theme}
            </span>
          ))}
        </div>
      )}

      {/* Observations */}
      {entry.observations && entry.observations.length > 0 && (
        <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 sm:p-7 shadow-sm space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E] block">
            Observations & Beliefs
          </span>
          <ul className="space-y-3">
            {entry.observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[#1A1A1A] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] mt-2 shrink-0" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* A Possible Pattern */}
      {entry.possiblePatterns && entry.possiblePatterns.length > 0 && (
        <div className="bg-[#F5F5F0] border border-[#E5E5E0] rounded-2xl p-6 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#5A5A40]">
            <TrendingUp className="w-4 h-4 text-[#5A5A40]" />
            <span>A possible pattern</span>
          </div>
          {entry.possiblePatterns.map((pat, idx) => (
            <p key={idx} className="text-sm font-serif italic text-[#1A1A1A] leading-relaxed">
              "{pat}"
            </p>
          ))}
        </div>
      )}

      {/* Reflection Question ("Something worth asking yourself") */}
      {entry.reflectionQuestion && (
        <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 sm:p-7 shadow-sm space-y-2.5">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#5A5A40] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#5A5A40]" />
            Something worth asking yourself
          </span>
          <p className="font-serif italic text-xl sm:text-2xl text-[#1A1A1A] font-medium leading-relaxed">
            "{entry.reflectionQuestion}"
          </p>
        </div>
      )}

      {/* Encouragement */}
      {entry.encouragement && (
        <div className="p-4 bg-[#F5F5F0] border border-[#E5E5E0] rounded-xl flex items-start gap-3 text-xs text-[#6B6B66]">
          <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
          <p className="leading-relaxed">{entry.encouragement}</p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E5E0]">
        <button
          id="btn-continue-in-chat"
          onClick={() => onContinueInChat(entry)}
          className="w-full sm:w-auto px-8 py-3 bg-[#5A5A40] text-white hover:bg-[#4A4A30] rounded-full text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-white/90" />
          <span>Talk to Echo about this</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onViewHistory}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-full text-sm font-medium transition-colors"
          >
            View in History
          </button>
          <button
            onClick={onWriteAnother}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1A1A1A] hover:opacity-90 text-white rounded-full text-sm font-medium transition-opacity"
          >
            New Entry
          </button>
        </div>
      </div>
    </div>
  );
};
