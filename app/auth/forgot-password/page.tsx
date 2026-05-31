"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "../../../components/auth/auth-shell";
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      showApiMessage(
        { message: response.message },
        {
          title: "Reset link sent",
          tone: "success",
          onClose: () => router.replace(`/auth/reset-password?email=${encodeURIComponent(email)}`),
        },
      );
    } catch (error) {
      showApiMessage(getAuthFeedbackToast(error), { title: "Reset request failed", tone: "error" });
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
      footerHref="/auth/login"
      footerLabel="Login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <Button type="submit" disabled={isLoading} className="w-full" variant="primary">
          {isLoading ? 'Sending link...' : 'Send reset link'}
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