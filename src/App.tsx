import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { JournalComposer } from "./components/JournalComposer";
import { ReflectionView } from "./components/ReflectionView";
import { ConversationView } from "./components/ConversationView";
import { PatternsView } from "./components/PatternsView";
import { HistoryView } from "./components/HistoryView";
import { EntryDetailModal } from "./components/EntryDetailModal";
import { SettingsView } from "./components/SettingsView";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { JournalEntry, ScreenType } from "./types";
import { fetchUserEntries, deleteEntry, seedDemoEntries } from "./lib/entries";
import { Loader2, Sparkles } from "lucide-react";

function MainApp() {
  const { user, isDemo, signInWithDemo, signOut, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("journal");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [activeReflectionEntry, setActiveReflectionEntry] = useState<JournalEntry | null>(null);
  const [focusChatEntry, setFocusChatEntry] = useState<JournalEntry | null>(null);
  const [detailEntry, setDetailEntry] = useState<JournalEntry | null>(null);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch entries whenever user logs in
  const loadEntries = async (uid: string) => {
    setEntriesLoading(true);
    try {
      const userEntries = await fetchUserEntries(uid);
      setEntries(userEntries);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setEntriesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadEntries(user.uid);
    } else {
      setEntries([]);
      setActiveReflectionEntry(null);
      setFocusChatEntry(null);
      setDetailEntry(null);
    }
  }, [user]);

  // Handle entry creation from JournalComposer
  const handleEntrySaved = (newEntry: JournalEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    setActiveReflectionEntry(newEntry);
    setCurrentScreen("reflection");
    addToast("Reflection generated and saved privately");
  };

  // Handle entry deletion
  const handleDeleteEntry = async (entryId: string) => {
    try {
      const res = await deleteEntry(entryId, user?.uid);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      if (activeReflectionEntry?.id === entryId) {
        setActiveReflectionEntry(null);
      }
      if (focusChatEntry?.id === entryId) {
        setFocusChatEntry(null);
      }
      if (detailEntry?.id === entryId) {
        setDetailEntry(null);
      }
      if (res?.wasProtected) {
        addToast("Sample demo baseline entry removed from view. Permanent demo data is preserved.", "info");
      } else {
        addToast("Journal entry deleted", "info");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      addToast("Failed to delete entry", "error");
    }
  };

  // Switch from demo mode to real sign up
  const handleCreateOwnJournal = async () => {
    await signOut();
    setAuthModalMode("signup");
    setIsAuthModalOpen(true);
  };

  // Handle demo dataset seeding
  const handleSeedDemo = async () => {
    if (!user) return;
    try {
      const created = await seedDemoEntries(user.uid);
      setEntries((prev) => [...created, ...prev]);
      addToast("Loaded 3 Ideathon demo entries with longitudinal patterns");
    } catch (err: any) {
      console.error("Seed error:", err);
      addToast("Failed to seed demo entries: " + err.message, "error");
    }
  };

  // Handle Continuing reflection into Chat
  const handleContinueInChat = (entry: JournalEntry) => {
    setFocusChatEntry(entry);
    setCurrentScreen("conversation");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-xs">
          <div className="w-5 h-5 border-2 border-white rounded-full opacity-80" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B66]">
          <Loader2 className="w-4 h-4 animate-spin text-[#5A5A40]" />
          <span>Opening Echo...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onStart={() => {
            setAuthModalMode("signup");
            setIsAuthModalOpen(true);
          }}
          onLogin={() => {
            setAuthModalMode("signin");
            setIsAuthModalOpen(true);
          }}
          onDemo={async () => {
            try {
              await signInWithDemo();
            } catch (err: any) {
              console.error("Demo start error:", err);
              setIsAuthModalOpen(true);
            }
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          defaultMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
        />

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // Authenticated User Dashboard Layout
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] flex flex-col md:flex-row selection:bg-[#F5F5F0]">
      {/* Navigation */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        entriesCount={entries.length}
        onCreateOwnJournal={handleCreateOwnJournal}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8 flex flex-col">
        {/* Subtle Demo Mode Header Banner */}
        {isDemo && (
          <header 
            id="demo-mode-header-banner"
            className="bg-[#FBFBF9]/95 backdrop-blur-xs border-b border-[#E5E5E0] px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#D5D5CE] font-medium text-[11px] text-[#1A1A1A] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#5A5A40]" />
                <span className="font-semibold">Demo Mode</span>
                <span className="text-[#8C8C85]">· Sample data</span>
              </span>
              <span className="hidden md:inline text-[11px] text-[#6B6B66]">
                Reviewing realistic multi-week thought patterns
              </span>
            </div>
            <button
              id="btn-create-own-journal"
              onClick={handleCreateOwnJournal}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A1A] hover:text-[#5A5A40] transition-colors cursor-pointer group"
            >
              <span>Create your own journal</span>
              <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
            </button>
          </header>
        )}

        {currentScreen === "journal" && (
          <JournalComposer onEntrySaved={handleEntrySaved} />
        )}

        {currentScreen === "reflection" && (
          activeReflectionEntry ? (
            <ReflectionView
              entry={activeReflectionEntry}
              onContinueInChat={handleContinueInChat}
              onWriteAnother={() => setCurrentScreen("journal")}
              onViewHistory={() => setCurrentScreen("history")}
            />
          ) : (
            <JournalComposer onEntrySaved={handleEntrySaved} />
          )
        )}

        {currentScreen === "conversation" && (
          <ConversationView
            entries={entries}
            focusEntry={focusChatEntry}
            onClearFocusEntry={() => setFocusChatEntry(null)}
          />
        )}

        {currentScreen === "patterns" && (
          <PatternsView
            entries={entries}
            onSeedDemo={handleSeedDemo}
            onNewEntry={() => setCurrentScreen("journal")}
          />
        )}

        {currentScreen === "history" && (
          <HistoryView
            entries={entries}
            onSelectEntry={(entry) => setDetailEntry(entry)}
            onDeleteEntry={handleDeleteEntry}
            onNewEntry={() => setCurrentScreen("journal")}
          />
        )}

        {currentScreen === "settings" && (
          <SettingsView
            entries={entries}
            onSeedDemo={handleSeedDemo}
          />
        )}
      </main>

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={detailEntry}
        onClose={() => setDetailEntry(null)}
        onContinueInChat={(entry) => {
          setDetailEntry(null);
          handleContinueInChat(entry);
        }}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
