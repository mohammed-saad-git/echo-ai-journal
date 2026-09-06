import React from "react";
import { 
  PenLine, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Compass,
  ArrowRight
} from "lucide-react";
import { ScreenType } from "../types";
import { useAuth } from "../context/AuthContext";

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  entriesCount: number;
  onCreateOwnJournal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentScreen, 
  onNavigate, 
  entriesCount,
  onCreateOwnJournal
}) => {
  const { user, isDemo, signOut } = useAuth();

  const navItems = [
    { id: "journal" as ScreenType, label: "Journal", icon: PenLine },
    { id: "conversation" as ScreenType, label: "Talk to Echo", icon: MessageSquare },
    { id: "patterns" as ScreenType, label: "Patterns", icon: Compass },
    { id: "history" as ScreenType, label: "History", icon: Clock, badge: entriesCount },
    { id: "settings" as ScreenType, label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5E5E0] h-screen sticky top-0 select-none z-30 justify-between"
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 pb-4">
            <div 
              onClick={() => onNavigate("journal")}
              className="cursor-pointer group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
                <div className="w-4 h-4 border-2 border-white rounded-full opacity-80" />
              </div>
              <div>
                <span className="text-xl font-semibold tracking-tight italic font-serif text-[#1A1A1A] block">Echo</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#A3A38E] block -mt-0.5">Private AI Journal</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#F5F5F0] text-[#1A1A1A] font-medium"
                      : "text-[#6B6B66] hover:bg-[#F5F5F0] hover:text-[#1A1A1A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#1A1A1A]" : "text-[#6B6B66]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5E5E0] text-[#1A1A1A] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* Demo Mode Action in Sidebar */}
          {isDemo && (
            <div className="px-4 py-3 mx-4 mb-3 bg-[#FBFBF9] rounded-xl border border-[#D5D5CE] text-xs shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Demo Mode</span>
                </span>
                <span className="text-[10px] text-[#A3A38E] font-medium">Sample data</span>
              </div>
              <button
                id="btn-sidebar-create-own-journal"
                onClick={onCreateOwnJournal}
                className="w-full mt-1 py-1.5 px-3 bg-[#1A1A1A] hover:bg-[#333330] text-white rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Create your own journal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Google Cloud Gen AI Academy APAC Badge */}
          <div className="px-4 py-3 mx-4 mb-3 bg-[#F5F5F0] rounded-xl border border-[#E5E5E0] text-[11px] text-[#6B6B66]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1A1A1A] mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Google Cloud Gen AI Academy</span>
            </div>
            <p className="text-[10px] text-[#6B6B66] leading-tight">
              APAC Ideathon MVP • Powered by Gemini on Cloud Run
            </p>
          </div>

          {/* User Profile / Footer */}
          <div className="p-4 border-t border-[#E5E5E0] bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A5A40] to-[#A3A38E] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || "U")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    {user?.displayName || (user?.email ? user.email.split("@")[0] : "Journaler")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#6B6B66]">
                    <ShieldCheck className="w-3 h-3 text-[#5A5A40]" />
                    <span>{isDemo ? "Isolated Demo Session" : "Encrypted & Private"}</span>
                  </div>
                </div>
              </div>
              <button
                id="btn-signout"
                onClick={() => signOut()}
                title="Sign out"
                className="p-1.5 text-[#6B6B66] hover:text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E0] px-2 py-1.5 flex items-center justify-around z-40"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-lg transition-colors ${
                isActive ? "text-[#1A1A1A] font-semibold" : "text-[#6B6B66]"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

