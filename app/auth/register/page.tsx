"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "../../../components/auth/auth-shell";
import { useAuth } from "../../../components/auth/auth-provider";
import { authApi, getAuthFeedbackToast } from "../../../lib/auth";
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

export default function RegisterPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const [name, setName] = useState("");
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
      router.replace("/workspace");
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
        Redirecting to your workspace...
      </main>
    );
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.register({ name, email, password });
      showApiMessage(
        { message: response.message },
        {
          title: "Account created",
          tone: "success",
          onClose: () => router.replace("/auth/login"),
        },
      );
    } catch (error) {
      showApiMessage(getAuthFeedbackToast(error), { title: "Registration failed", tone: "error" });
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
      footerHref="/auth/login"
      footerLabel="Login"
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <Input
          label="Name"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />

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
          placeholder="Create a password"
          minLength={8}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
          title="Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
          required
        />
        <p className="-mt-3 text-xs leading-5 text-text-secondary">
          Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
        </p>

        <Button type="submit" disabled={isLoading} className="w-full" variant="primary">
          {isLoading ? 'Creating account...' : 'Register'}
        </Button>

        <p className="text-sm leading-6 text-text-secondary">
          By creating an account, you can later verify your email and unlock application access.
        </p>
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