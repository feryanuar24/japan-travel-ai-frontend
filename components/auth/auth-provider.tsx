"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { AuthSession } from "../../lib/auth";
import { clearAuthSession, getAuthSession, setAuthSession, subscribeAuthSession } from "../../lib/auth";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isReady: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);
  const isReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        isReady,
        setSession: setAuthSession,
        clearSession: clearAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}