"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "../../components/auth/auth-shell";
import { useAuth } from "../../components/auth/auth-provider";
import { useFeedback } from "../../components/feedback/feedback";
import { authApi, getAuthFeedbackToast, setAuthSession } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const { showFeedback } = useFeedback();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isReady && session) {
      router.replace("/dashboard");
    }
  }, [isReady, router, session]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Checking session...
      </main>
    );
  }

  if (session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Redirecting to dashboard...
      </main>
    );
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { message: responseMessage, data } = await authApi.login({ email, password });

      setAuthSession(data);
      showFeedback({ message: responseMessage }, { tone: "success" });
      router.replace("/dashboard");
    } catch (error) {
      showFeedback(getAuthFeedbackToast(error), { tone: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to access your dashboard, protected travel plans, and personalized Japan AI tools."
      accent="Login"
      footerText="Need an account?"
      footerHref="/register"
      footerLabel="Register"
    >
      <form onSubmit={handleLogin} className="space-y-5">
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

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/forgot-password" className="font-medium text-slate-600 transition hover:text-slate-950">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
