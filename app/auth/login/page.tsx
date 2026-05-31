"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "../../../components/auth/auth-shell";
import { useAuth } from "../../../components/auth/auth-provider";
import { authApi, getAuthFeedbackToast, getHomeRouteForRole, setAuthSession } from "../../../lib/auth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";

type ApiMessageState = {
  title: string;
  tone: "error" | "success";
  message: string;
  details?: string[];
  onClose?: () => void;
};

export default function LoginPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<ApiMessageState | null>(null);

  const showApiMessage = (
    message: { message: string; details?: string[] },
    options: Omit<ApiMessageState, "message" | "details"> = { title: "Action needed", tone: "error" },
  ) => {
    setApiMessage({
      title: options.title,
      tone: options.tone,
      message: message.message,
      details: message.details,
      onClose: options.onClose,
    });
  };

  const closeApiMessage = () => {
    const onClose = apiMessage?.onClose;

    setApiMessage(null);
    onClose?.();
  };

  useEffect(() => {
    if (isReady && session) {
      router.replace(getHomeRouteForRole(session.user.role));
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
    const destination = getHomeRouteForRole(session.user.role);

    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Redirecting to your {destination === "/admin/dashboard" ? "admin console" : "workspace"}...
      </main>
    );
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { message: responseMessage, data } = await authApi.login({ email, password });

      setAuthSession(data);
      showApiMessage(
        { message: responseMessage },
        {
          title: "Login successful",
          tone: "success",
          onClose: () => router.replace(getHomeRouteForRole(data.user.role)),
        },
      );
    } catch (error) {
      showApiMessage(getAuthFeedbackToast(error), { title: "Login failed", tone: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to access your travel workspace, saved plans, and personalized Japan AI tools."
      accent="Login"
      footerText="Need an account?"
      footerHref="/auth/register"
      footerLabel="Register"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-text-secondary transition hover:text-text">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" variant="primary">
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      {apiMessage ? (
        <Modal open onClose={closeApiMessage} title={apiMessage.title}>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {apiMessage.tone === "success" ? "Success" : "Action needed"}
              </p>
              <p className="whitespace-pre-wrap wrap-break-word text-base leading-7 text-text">
                {apiMessage.message}
              </p>
            </div>

            {apiMessage.details?.length ? (
              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-sm font-semibold text-text-secondary">Details</p>
                <ul className="space-y-2 text-sm leading-6 text-text-secondary">
                  {apiMessage.details.map((detail, index) => (
                    <li key={`${detail}-${index}`} className="whitespace-pre-wrap wrap-break-word">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeApiMessage}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </AuthShell>
  );
}