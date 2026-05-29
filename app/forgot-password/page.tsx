"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "../../components/auth/auth-shell";
import { useFeedback } from "../../components/feedback/feedback";
import { authApi, getAuthFeedbackToast } from "../../lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      showFeedback({ message: response.message }, { tone: "success" });
      router.replace(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      showFeedback(getAuthFeedbackToast(error), { tone: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      description="Send a password reset link to your email address and regain access to your account."
      accent="Forgot Password"
      footerText="Remembered your password?"
      footerHref="/login"
      footerLabel="Login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Sending link..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}