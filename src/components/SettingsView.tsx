import React, { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Sparkles, 
  LogOut, 
  Database, 
  Server, 
  Key, 
  Check, 
  Loader2,
  FileText
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { JournalEntry } from "../types";

interface SettingsViewProps {
  entries: JournalEntry[];
  onSeedDemo: () => Promise<void>;
  onClearAll?: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  entries, 
  onSeedDemo 
}) => {
  const { user, signOut } = useAuth();
  const [downloaded, setDownloaded] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Export JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `echo-journal-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await onSeedDemo();
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1C1A]">
          Account & Privacy
        </h1>
        <p className="text-sm text-[#717069] mt-1">
          Manage your private journal settings and examine data isolation.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#717069]">
          Authenticated Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1C1C1A] text-white flex items-center justify-center font-bold text-lg">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || "E")}
          </div>
          <div>
            <h4 className="text-base font-bold text-[#1C1C1A]">
              {user?.displayName || "Journal Author"}
            </h4>
            <p className="text-xs text-[#717069]">{user?.email || "Authenticated via Firebase"}</p>
            <p className="text-[11px] text-[#8C8A81] font-mono mt-0.5">UID: {user?.uid}</p>
          </div>
        </div>
      </div>

      {/* Privacy & Firestore Rules Badge */}
      <div className="bg-[#FAF9F6] border border-[#E0DED7] rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Data Isolation</span>
        </div>
        <p className="text-xs sm:text-sm text-[#595852] leading-relaxed">
          Echo enforces Firestore security rules that strictly isolate your entries to your user ID. User data cannot be read, updated, or deleted by any other authenticated user.
        </p>
        <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-[#717069]">
          <span className="px-2.5 py-1 bg-white border border-[#E0DED7] rounded-lg">
            Database ID: ai-studio-echoprivateaijou-...
          </span>
          <span className="px-2.5 py-1 bg-white border border-[#E0DED7] rounded-lg">
            Token: Firebase Auth JWT verified server-side
          </span>
        </div>
      </div>

      {/* Ideathon Architecture Showcase */}
      <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-[#92400E] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Google Cloud Gen AI Academy APAC Ideathon</span>
          </div>
          <h3 className="text-base font-bold text-[#1C1C1A]">Architecture & Production Stack</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#1C1C1A]">
              <Server className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Google Cloud Run</span>
            </div>
            <p className="text-[#717069]">
              Containerized full-stack deployment with zero-server maintenance.
            </p>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#1C1C1A]">
              <Key className="w-3.5 h-3.5 text-[#FBBC05]" />
              <span>Secret Manager</span>
            </div>
            <p className="text-[#717069]">
              Gemini API keys securely stored and fetched server-side only.
            </p>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#1C1C1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#34A853]" />
              <span>Gemini 3.8 Flash</span>
            </div>
            <p className="text-[#717069]">
              Structured JSON reflection, multi-turn chat, and pattern synthesis.
            </p>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#1C1C1A]">
              <Database className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Cloud Firestore</span>
            </div>
            <p className="text-[#717069]">
              Per-user isolated document collection with strict security rules.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#717069]">
          Data Management
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div>
            <h4 className="text-sm font-semibold text-[#1C1C1A]">Export Your Journal</h4>
            <p className="text-xs text-[#717069]">
              Download an offline copy of your entire journal and AI reflections in JSON.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E0DED7] hover:bg-[#F5F4F0] text-xs font-semibold text-[#2B2A27] rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloaded ? "Exported!" : "Export JSON"}</span>
          </button>
        </div>

        <div className="border-t border-[#F0EFEA] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#1C1C1A]">Seed Ideathon Demo Data</h4>
            <p className="text-xs text-[#717069]">
              Add 3 curated realistic journal entries spanning the last month to test the patterns engine.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full sm:w-auto px-4 py-2 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#92400E] rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />}
            <span>Seed Demo Data</span>
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          onClick={() => signOut()}
          className="px-5 py-2.5 bg-white border border-[#FCA5A5] text-[#991B1B] hover:bg-[#FEE2E2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Echo</span>
        </button>
      </div>
    </div>
  );
};
