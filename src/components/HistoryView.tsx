import React, { useState, useMemo } from "react";
import { 
  Search, 
  Trash2, 
  Calendar, 
  Tag, 
  Heart, 
  ArrowRight, 
  AlertTriangle,
  FileText,
  Plus
} from "lucide-react";
import { JournalEntry } from "../types";

interface HistoryViewProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => Promise<void>;
  onNewEntry: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onNewEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract all unique themes from entries
  const allThemes = useMemo(() => {
    const themeSet = new Set<string>();
    entries.forEach((e) => {
      (e.themes || []).forEach((t) => themeSet.add(t));
    });
    return Array.from(themeSet);
  }, [entries]);

  // Filtered and searched entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      // Theme filter
      if (selectedTheme !== "all" && !e.themes?.includes(selectedTheme)) {
        return false;
      }
      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const contentMatch = e.content.toLowerCase().includes(q);
      const summaryMatch = e.summary?.toLowerCase().includes(q);
      const themeMatch = e.themes?.some((t) => t.toLowerCase().includes(q));
      return contentMatch || summaryMatch || themeMatch;
    });
  }, [entries, searchQuery, selectedTheme]);

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteEntry(entryToDelete.id);
      setEntryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#1A1A1A] tracking-tight">
            Journal <span className="font-serif italic font-semibold">History</span>
          </h1>
          <p className="text-sm text-[#6B6B66] mt-0.5">
            {entries.length} reflections recorded over time
          </p>
        </div>

        <button
          onClick={onNewEntry}
          className="self-start sm:self-auto px-5 py-2.5 bg-[#5A5A40] text-white hover:bg-[#4A4A30] rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A3A38E] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by thoughts, summary, or emotions..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E5E5E0] rounded-full text-sm text-[#1A1A1A] placeholder:text-[#A3A38E] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]/15 focus:border-[#5A5A40] shadow-2xs transition-all"
          />
        </div>

        {/* Theme Pills */}
        {allThemes.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedTheme("all")}
              className={`px-3.5 py-1 rounded-full transition-colors shrink-0 font-medium ${
                selectedTheme === "all"
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white border border-[#E5E5E0] text-[#6B6B66] hover:text-[#1A1A1A]"
              }`}
            >
              All Themes
            </button>
            {allThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3.5 py-1 rounded-full transition-colors shrink-0 font-medium ${
                  selectedTheme === theme
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white border border-[#E5E5E0] text-[#6B6B66] hover:text-[#1A1A1A]"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E5E0] space-y-3">
          <FileText className="w-8 h-8 text-[#A3A38E] mx-auto" />
          <p className="text-sm font-serif italic text-[#1A1A1A]">No journal entries found</p>
          <p className="text-xs text-[#6B6B66] max-w-sm mx-auto">
            {searchQuery || selectedTheme !== "all"
              ? "Try adjusting your search terms or filter."
              : "Write your first journal entry to start seeing your thought history."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const dateStr = entry.createdAt
              ? new Date(entry.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              : "Recent";

            return (
              <div
                key={entry.id}
                className="bg-white border border-[#E5E5E0] hover:border-[#5A5A40]/40 rounded-2xl p-6 shadow-sm transition-all space-y-3.5 group"
              >
                {/* Top info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEntryToDelete(entry)}
                      title="Delete entry"
                      className="p-1.5 text-[#A3A38E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Summary */}
                {entry.summary && (
                  <p className="text-base font-serif italic font-semibold text-[#1A1A1A] leading-snug">
                    "{entry.summary}"
                  </p>
                )}

                {/* Content excerpt */}
                <p className="text-xs text-[#6B6B66] line-clamp-2 leading-relaxed">
                  {entry.content}
                </p>

                {/* Emotions and Themes footer */}
                <div className="pt-2 border-t border-[#F5F5F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.emotions?.slice(0, 2).map((emo, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] text-[11px] text-[#1A1A1A]"
                      >
                        {emo.name} · {emo.intensity}/10
                      </span>
                    ))}
                    {entry.themes?.slice(0, 2).map((theme, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-white border border-[#E5E5E0] text-[11px] text-[#6B6B66]"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectEntry(entry)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#5A5A40] hover:text-[#4A4A30] cursor-pointer ml-auto"
                  >
                    <span>View reflection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl space-y-4 border border-[#E5E5E0]">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif italic font-semibold text-base text-[#1A1A1A]">Delete this journal entry?</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                This will permanently delete this reflection from your private Firestore database.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEntryToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-full border border-[#E5E5E0] text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F5F0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 text-xs font-medium transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
