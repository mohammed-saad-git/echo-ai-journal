import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  onAuthStateChanged,
  updateProfile
} from "../lib/firebase";
import { AuthUser } from "../types";
import { DEMO_USER_PROFILE } from "../lib/demoData";

interface AuthContextType {
  user: AuthUser | null;
  isDemo: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if there was an active demo session stored
    const existingDemoToken = sessionStorage.getItem("echo_demo_auth_token");
    if (existingDemoToken) {
      setUser({
        uid: DEMO_USER_PROFILE.uid,
        email: DEMO_USER_PROFILE.email,
        displayName: DEMO_USER_PROFILE.displayName,
        isDemo: true,
      });
      setIsDemo(true);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          isDemo: false,
        });
        setIsDemo(false);
        // Clear any lingering demo tokens
        sessionStorage.removeItem("echo_demo_auth_token");
      } else if (!sessionStorage.getItem("echo_demo_auth_token")) {
        setUser(null);
        setIsDemo(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    sessionStorage.removeItem("echo_demo_auth_token");
    setIsDemo(false);
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    sessionStorage.removeItem("echo_demo_auth_token");
    setIsDemo(false);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    sessionStorage.removeItem("echo_demo_auth_token");
    setIsDemo(false);
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
  };

  // Demo Mode Authentication: mints cryptographic demo token without exposing credentials
  const signInWithDemo = async () => {
    try {
      const response = await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to initialize demo session");
      }

      const data = await response.json();
      sessionStorage.setItem("echo_demo_auth_token", data.token);

      setUser({
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName,
        isDemo: true,
      });
      setIsDemo(true);
    } catch (err) {
      console.error("Demo authentication error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    sessionStorage.removeItem("echo_demo_auth_token");
    setIsDemo(false);
    setUser(null);
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn("Sign out notice:", e);
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (isDemo) {
      return sessionStorage.getItem("echo_demo_auth_token");
    }
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken(true);
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isDemo,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInWithDemo,
      signOut,
      getIdToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

