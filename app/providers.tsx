"use client";

import { AuthProvider } from "../components/auth/auth-provider";
import { FeedbackProvider } from "../components/feedback/feedback";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FeedbackProvider>{children}</FeedbackProvider>
    </AuthProvider>
  );
}