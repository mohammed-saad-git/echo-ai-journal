import React, { useState } from "react";
import { 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Feather, 
  Compass, 
  CheckCircle2, 
  Brain,
  ShieldCheck
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, onDemo }) => {
  const [activeTab, setActiveTab] = useState<"reflection" | "patterns" | "conversation">("reflection");

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] selection:bg-[#5A5A40]/20">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic text-base shadow-2xs">
            E
          </div>
          <span className="font-serif italic font-semibold text-xl tracking-tight">Echo</span>
        </div>
        <div className="flex items-center gap-3">
          {onDemo && (
            <button
              id="btn-header-demo"
              onClick={onDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-white border border-[#E5E5E0] hover:bg-[#F5F5F0] rounded-full transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Try Demo</span>
            </button>
          )}
          <button
            id="btn-landing-signin"
            onClick={onLogin}
            className="px-4 py-2 text-xs font-medium text-[#6B6B66] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            id="btn-landing-getstarted"
            onClick={onStart}
            className="px-5 py-2 bg-[#5A5A40] text-white hover:bg-[#4A4A30] text-xs font-medium rounded-full shadow-sm transition-all duration-150 cursor-pointer"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E0] text-xs font-medium text-[#5A5A40] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Google Cloud Gen AI Academy APAC Ideathon MVP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#1A1A1A] leading-[1.15]">
            Your thoughts, <span className="font-serif italic font-semibold">understood.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#6B6B66] font-normal leading-relaxed max-w-2xl mx-auto">
            Echo is a private AI journal that helps you uncover the patterns behind what you think, feel, and do over time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-hero-start"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#5A5A40] text-white hover:bg-[#4A4A30] rounded-full text-sm font-medium shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start journaling</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onDemo && (
              <button
                id="btn-hero-demo"
                onClick={onDemo}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-full text-sm font-medium transition-colors border border-[#E5E5E0] flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                <span>Try Demo</span>
              </button>
            )}
            <button
              id="btn-hero-see-works"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-[#F5F5F0] text-[#6B6B66] hover:text-[#1A1A1A] rounded-full text-sm font-medium transition-colors cursor-pointer"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Interactive Product Preview Mockup */}
        <div className="mt-16 max-w-4xl mx-auto bg-white border border-[#E5E5E0] rounded-2xl shadow-xl shadow-[#5A5A40]/5 overflow-hidden">
          {/* Mockup Toolbar */}
          <div className="px-6 py-4 bg-[#F5F5F0] border-b border-[#E5E5E0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">Live Preview • Echo Intelligence</span>
            </div>
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#E5E5E0] text-xs font-medium">
              <button
                onClick={() => setActiveTab("reflection")}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  activeTab === "reflection" ? "bg-[#1A1A1A] text-white font-medium shadow-2xs" : "text-[#6B6B66] hover:text-[#1A1A1A]"
                }`}
              >
                AI Reflection
              </button>
              <button
                onClick={() => setActiveTab("patterns")}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  activeTab === "patterns" ? "bg-[#1A1A1A] text-white font-medium shadow-2xs" : "text-[#6B6B66] hover:text-[#1A1A1A]"
                }`}
              >
                Patterns
              </button>
              <button
                onClick={() => setActiveTab("conversation")}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  activeTab === "conversation" ? "bg-[#1A1A1A] text-white font-medium shadow-2xs" : "text-[#6B6B66] hover:text-[#1A1A1A]"
                }`}
              >
                Conversation
              </button>
            </div>
          </div>

          {/* Mockup Content Body */}
          <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8">
            {/* Left: The Journal Entry */}
            <div className="md:col-span-5 bg-[#F5F5F0] p-5 rounded-xl border border-[#E5E5E0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#A3A38E] uppercase tracking-widest">User Journal Entry</span>
                <span className="text-xs text-[#A3A38E]">Today, 9:42 PM</span>
              </div>
              <p className="font-serif italic text-base text-[#1A1A1A] leading-relaxed">
                "I spent almost three hours analyzing whether to accept the new team lead role. I know I have the technical chops, but I dread being in the spotlight and making mistakes everyone can see. So instead of deciding, I reorganized my task board for the fourth time this week."
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#6B6B66]">
                <Feather className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>312 characters • Stream of thought</span>
              </div>
            </div>

            {/* Right: Gemini Analysis */}
            <div className="md:col-span-7 space-y-4">
              {activeTab === "reflection" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-[#5A5A40] text-white p-5 rounded-xl space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-white/80">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini 3.8 Flash Reflection</span>
                    </div>
                    <p className="font-serif italic text-base sm:text-lg text-white font-medium leading-relaxed">
                      "You seem to be balancing confidence in your technical capability with fear of public vulnerability."
                    </p>
                  </div>

                  {/* Emotion Pill Gauges */}
                  <div>
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-[#A3A38E] block mb-1.5">What you're feeling</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#F5F5F0] border border-[#E5E5E0] p-2.5 rounded-lg text-center">
                        <span className="text-xs font-medium text-[#1A1A1A] block">Uncertainty</span>
                        <span className="text-xs text-[#5A5A40] font-mono font-semibold">8/10</span>
                      </div>
                      <div className="bg-[#F5F5F0] border border-[#E5E5E0] p-2.5 rounded-lg text-center">
                        <span className="text-xs font-medium text-[#1A1A1A] block">Ambition</span>
                        <span className="text-xs text-emerald-700 font-mono font-semibold">7/10</span>
                      </div>
                      <div className="bg-[#F5F5F0] border border-[#E5E5E0] p-2.5 rounded-lg text-center">
                        <span className="text-xs font-medium text-[#1A1A1A] block">Vulnerability</span>
                        <span className="text-xs text-rose-700 font-mono font-semibold">6/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Themes */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-[#A3A38E] mr-1">Themes:</span>
                    {["Decision-making", "Productive Procrastination", "Career Leadership"].map((t) => (
                      <span key={t} className="px-3 py-0.5 rounded-full bg-white border border-[#E5E5E0] text-[#1A1A1A] text-xs font-medium shadow-2xs">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Reflection Question Card */}
                  <div className="p-4 bg-[#F5F5F0] border border-[#E5E5E0] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#5A5A40] block">Something worth asking yourself</span>
                    <p className="font-serif italic text-base text-[#1A1A1A] font-medium">
                      "Are you afraid of making the wrong decision — or of committing to one?"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "patterns" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">Emerging Behavioral Pattern</span>
                    <span className="text-xs text-[#5A5A40] font-medium bg-[#F5F5F0] border border-[#E5E5E0] px-2.5 py-0.5 rounded-full">Observed in 4 entries</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E5E5E0] rounded-xl space-y-1.5 shadow-2xs">
                    <h4 className="font-serif italic font-semibold text-base text-[#1A1A1A]">Productive avoidance under scrutiny</h4>
                    <p className="text-xs text-[#6B6B66] leading-relaxed">
                      Whenever high-visibility opportunities arise, you channel anxiety into administrative or reorganization tasks (like board tidying) rather than making the definitive move.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F5F0] border border-[#E5E5E0] rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#5A5A40] block mb-1">Perspective Shift Detected</span>
                    <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                      <span className="line-through text-[#A3A38E]">"I need zero risk before starting."</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#5A5A40]" />
                      <span className="font-serif italic font-semibold">"I can learn through imperfect execution."</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "conversation" && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <div className="bg-[#1A1A1A] text-white p-3.5 rounded-2xl rounded-tr-xs max-w-[85%] ml-auto">
                    "Why do I keep delaying this decision?"
                  </div>
                  <div className="bg-white border border-[#E5E5E0] p-4 rounded-2xl rounded-tl-xs text-[#1A1A1A] leading-relaxed max-w-[95%] space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-serif italic text-xs font-semibold text-[#1A1A1A]">
                      <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                      <span>Echo</span>
                    </div>
                    <p>
                      You've mentioned this goal several times across your entries. There seems to be tension between wanting to move quickly and wanting to make the unimpeachable choice.
                    </p>
                    <p className="text-[#6B6B66]">
                      When stakes feel personally tied to your identity as a builder, you treat delay as safety.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: How Echo Works */}
        <section id="how-it-works" className="mt-32 pt-16 border-t border-[#E5E5E0]">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#A3A38E]">Methodology</span>
            <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
              How Echo <span className="font-serif italic font-semibold">works</span>
            </h2>
            <p className="text-[#6B6B66] text-sm leading-relaxed">
              Designed to help you think clearly without unsolicited lectures or artificial dopamine loops.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-[#E5E5E0] shadow-sm space-y-3.5">
              <div className="w-9 h-9 rounded-full bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center font-mono text-sm font-semibold">
                1
              </div>
              <h3 className="font-serif italic font-semibold text-lg text-[#1A1A1A]">Write freely</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Write unedited about your day, frustrations, relationships, or decisions. No forms to fill, no mandatory templates.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#E5E5E0] shadow-sm space-y-3.5">
              <div className="w-9 h-9 rounded-full bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center font-mono text-sm font-semibold">
                2
              </div>
              <h3 className="font-serif italic font-semibold text-lg text-[#1A1A1A]">Reflect with Gemini</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Gemini uncovers emotional undertones, assumptions, and themes in a structured, calm, and non-diagnostic format.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#E5E5E0] shadow-sm space-y-3.5">
              <div className="w-9 h-9 rounded-full bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center font-mono text-sm font-semibold">
                3
              </div>
              <h3 className="font-serif italic font-semibold text-lg text-[#1A1A1A]">Discover patterns</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Over multiple entries, Echo identifies recurring themes, subtle avoidance habits, and major shifts in how you think.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Product Philosophy & Privacy */}
        <section className="mt-32 p-10 md:p-14 bg-white border border-[#E5E5E0] rounded-3xl shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] text-[#5A5A40] flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1A1A1A]">
              Your journal belongs <span className="font-serif italic font-semibold">to you.</span>
            </h2>
            <p className="text-sm text-[#6B6B66] leading-relaxed">
              Your entries are private and strictly isolated to your authenticated account. Firestore security rules enforce that no other user can ever read, edit, or access your journal or conversations.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#6B6B66]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
                Per-user Firestore rules
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                No third-party data broker sharing
              </span>
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#5A5A40]" />
                Private Gemini instance proxy
              </span>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="mt-28 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1A1A1A]">
            Start understanding <span className="font-serif italic font-semibold">yourself.</span>
          </h2>
          <p className="text-sm text-[#6B6B66] max-w-md mx-auto">
            Experience what happens when your reflections are met with clarity rather than noise.
          </p>
          <div>
            <button
              id="btn-footer-start"
              onClick={onStart}
              className="px-8 py-3.5 bg-[#5A5A40] text-white hover:bg-[#4A4A30] rounded-full text-sm font-medium shadow-sm transition-all duration-150 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Start journaling</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#E5E5E0] py-8 text-center text-xs text-[#A3A38E]">
        <p>© {new Date().getFullYear()} Echo. Built for the Google Cloud Gen AI Academy APAC Ideathon.</p>
      </footer>
    </div>
  );
};
