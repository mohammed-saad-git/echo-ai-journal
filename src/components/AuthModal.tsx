import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock, Mail, User as UserIcon, AlertCircle, Loader2, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = "signin" 
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithDemo } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name.");
        }
        await signUpWithEmail(email, password, name);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "Authentication failed. Please try again.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code === "auth/unauthorized-domain") {
        setError("This preview domain is not authorized in Firebase Console. Please sign in with Email & Password or use Demo Mode.");
      } else if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed") {
        setError("Google Provider is not enabled in Firebase Console. You can sign in using Email & Password or Demo Mode.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please enable popups or sign in with Email & Password.");
      } else if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign in with Google. Try Email & Password below.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryDemo = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithDemo();
      onClose();
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError("Demo access initialization failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-[#FBFBF9] border border-[#E5E5E0] rounded-2xl shadow-2xl p-6 sm:p-8 relative"
      >
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#A3A38E] hover:text-[#1A1A1A] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic text-base mx-auto mb-3 shadow-2xs">
            E
          </div>
          <h2 className="text-2xl font-light tracking-tight text-[#1A1A1A]">
            {mode === "signin" ? (
              <>Welcome <span className="font-serif italic font-semibold">back</span></>
            ) : (
              <>Create your <span className="font-serif italic font-semibold">private journal</span></>
            )}
          </h2>
          <p className="text-xs text-[#6B6B66] mt-1">
            {mode === "signin" 
              ? "Sign in to access your thoughts, reflections, and patterns."
              : "All entries are encrypted and isolated strictly to your account."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Google Sign In */}
        <button
          id="btn-auth-google"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#F5F5F0] border border-[#E5E5E0] text-[#1A1A1A] rounded-full text-xs font-medium flex items-center justify-center gap-2.5 shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-[11px] text-[#A3A38E] text-center mt-2 leading-tight">
          Preview note: If Google sign-in encounters a 401 error, use Email sign-up below or Try Demo.
        </p>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E5E0]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#FBFBF9] px-3 text-[#A3A38E]">or with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-semibold text-[#A3A38E] mb-1">Your Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#A3A38E] absolute left-3.5 top-3" />
                <input
                  id="auth-input-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E5E5E0] rounded-full text-[#1A1A1A] placeholder:text-[#A3A38E] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]/15 focus:border-[#5A5A40] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-widest font-semibold text-[#A3A38E] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A3A38E] absolute left-3.5 top-3" />
              <input
                id="auth-input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E5E5E0] rounded-full text-[#1A1A1A] placeholder:text-[#A3A38E] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]/15 focus:border-[#5A5A40] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest font-semibold text-[#A3A38E] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A3A38E] absolute left-3.5 top-3" />
              <input
                id="auth-input-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E5E5E0] rounded-full text-[#1A1A1A] placeholder:text-[#A3A38E] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]/15 focus:border-[#5A5A40] transition-all"
              />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-[#5A5A40] hover:bg-[#4A4A30] text-white text-xs font-medium rounded-full shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-[#6B6B66]">
          {mode === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="font-semibold text-[#1A1A1A] underline hover:text-[#5A5A40] cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="font-semibold text-[#1A1A1A] underline hover:text-[#5A5A40] cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Secondary Try Demo Option */}
        <div className="pt-4 border-t border-[#E5E5E0] mt-4 text-center">
          <p className="text-xs font-medium text-[#6B6B66] mb-2">Just exploring?</p>
          <button
            id="btn-try-demo"
            type="button"
            onClick={handleTryDemo}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl border border-[#D5D5CE] hover:border-[#1A1A1A] bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] font-medium text-xs transition-all shadow-2xs flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A5A40] group-hover:scale-110 transition-transform" />
            <span className="font-semibold tracking-tight">✨ Try Demo</span>
          </button>
          <p className="text-[11px] text-[#A3A38E] mt-1.5 font-normal">
            No account required · Sample data
          </p>
        </div>
      </div>
    </div>
  );
};

