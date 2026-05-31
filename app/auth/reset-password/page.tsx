"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
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

  const email = searchParams.get("email");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({ token, password });
      showApiMessage(
        { message: response.message },
        {
          title: "Password updated",
          tone: "success",
          onClose: () => router.replace("/auth/login"),
        },
      );
    } catch (error) {
      showApiMessage(getAuthFeedbackToast(error), { title: "Password reset failed", tone: "error" });
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
      footerHref="/auth/login"
      footerLabel="Login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
          {email ? (
            <div className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
              Reset link requested for {email}
            </div>
          ) : null}

          <Input
            label="Reset Token"
            id="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste your reset token"
            required
          />

          <Input
            label="New Password"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a new password"
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full" variant="primary">
            {isLoading ? 'Updating password...' : 'Reset password'}
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