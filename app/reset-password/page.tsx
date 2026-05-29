"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "../../components/auth/auth-shell";
import { useFeedback } from "../../components/feedback/feedback";
import { authApi, getAuthFeedbackToast } from "../../lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showFeedback } = useFeedback();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get("email");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({ token, password });
      showFeedback({ message: response.message }, { tone: "success" });
      router.replace("/login");
    } catch (error) {
      showFeedback(getAuthFeedbackToast(error), { tone: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      description="Use your reset token to complete the password recovery flow and restore account access."
      accent="Reset Password"
      footerText="Back to login?"
      footerHref="/login"
      footerLabel="Login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {email ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Reset link requested for {email}
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="token" className="text-sm font-medium text-slate-700">
            Reset Token
          </label>
          <input
            id="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste your reset token"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a new password"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Updating password..." : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
}