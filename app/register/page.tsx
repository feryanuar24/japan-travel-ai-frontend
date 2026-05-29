"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "../../components/auth/auth-shell";
import { useAuth } from "../../components/auth/auth-provider";
import { useFeedback } from "../../components/feedback/feedback";
import { authApi, getAuthFeedbackToast } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const { showFeedback } = useFeedback();
  const [name, setName] = useState("");
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

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.register({ name, email, password });
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
      title="Create your account"
      description="Register to start building travel plans, saved destinations, and AI-assisted trip ideas."
      accent="Register"
      footerText="Already have an account?"
      footerHref="/login"
      footerLabel="Login"
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="your name"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            required
          />
        </div>

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
            placeholder="Create a password"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm leading-6 text-slate-500">
          By creating an account, you can later verify your email and unlock application access.
        </p>
      </form>
    </AuthShell>
  );
}