import React from "react";
import { 
  X, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Heart, 
  Tag, 
  HelpCircle, 
  TrendingUp,
  FileText
} from "lucide-react";
import { JournalEntry } from "../types";

interface EntryDetailModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onContinueInChat: (entry: JournalEntry) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  onClose,
  onContinueInChat,
}) => {
  if (!entry) return null;

  const dateStr = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Recent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#FAF9F6] border border-[#E8E6DF] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#717069] hover:text-[#1C1C1A] bg-white rounded-lg border border-[#E0DED7] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[#717069] mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateStr}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1A]">
            Journal Entry & Reflection
          </h2>
        </div>

        {/* Original Entry Section */}
        <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C8A81]">
            <FileText className="w-3.5 h-3.5" />
            <span>Original Journal Entry</span>
          </div>
          <p className="font-editorial text-base sm:text-lg text-[#2B2A27] leading-relaxed italic whitespace-pre-wrap">
            "{entry.content}"
          </p>
        </div>

        {/* AI Reflection Section */}
        <div className="space-y-4">
          {/* Summary */}
          {entry.summary && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                What Stands Out
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#78350F] leading-relaxed">
                "{entry.summary}"
              </p>
            </div>
          )}

          {/* Emotions & Themes */}
          <div className="grid sm:grid-cols-2 gap-4">
            {entry.emotions && entry.emotions.length > 0 && (
              <div className="bg-white border border-[#E8E6DF] p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#717069] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#E57373]" />
                  What You're Feeling
                </span>
                <div className="space-y-2">
                  {entry.emotions.map((emo, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1C1C1A]">{emo.name}</span>
                      <span className="text-[#717069] font-bold">{emo.intensity}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.themes && entry.themes.length > 0 && (
              <div className="bg-white border border-[#E8E6DF] p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#717069] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Themes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {entry.themes.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#E0DED7] text-xs font-medium text-[#4A4944]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Observations */}
          {entry.observations && entry.observations.length > 0 && (
            <div className="bg-white border border-[#E8E6DF] p-5 rounded-2xl space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717069] block">
                Observations & Beliefs
              </span>
              <ul className="space-y-2">
                {entry.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#383733] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#717069] mt-2 shrink-0" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Possible Patterns */}
          {entry.possiblePatterns && entry.possiblePatterns.length > 0 && (
            <div className="bg-white border border-[#E8E6DF] p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717069] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" />
                Possible Patterns
              </span>
              {entry.possiblePatterns.map((pat, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[#2B2A27] font-medium leading-relaxed">
                  "{pat}"
                </p>
              ))}
            </div>
          )}

          {/* Reflection Question */}
          {entry.reflectionQuestion && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />
                Something Worth Asking Yourself
              </span>
              <p className="font-editorial text-lg text-[#78350F] font-semibold italic">
                "{entry.reflectionQuestion}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-[#E8E6DF] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onContinueInChat(entry);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#1C1C1A] text-[#FAF9F6] hover:bg-[#33322E] rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Continue this reflection in chat</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-white border border-[#E0DED7] hover:bg-[#F5F4F0] rounded-xl text-xs font-medium text-[#2B2A27] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
