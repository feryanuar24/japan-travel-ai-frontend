"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type FeedbackTone = "error" | "success";

export type Feedback = {
  message: string;
  details?: string[];
};

type FeedbackToast = Feedback & {
  id: string;
  tone: FeedbackTone;
};

type ShowFeedbackOptions = {
  tone?: FeedbackTone;
  durationMs?: number;
};

type FeedbackContextValue = {
  showFeedback: (feedback: Feedback, options?: ShowFeedbackOptions) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function createToastId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function FeedbackToastView({ feedback, tone }: { feedback: Feedback; tone: FeedbackTone }) {
  const hasDetails = Boolean(feedback.details?.length);

  return (
    <div
      className={[
        "pointer-events-auto w-full max-w-md rounded-3xl border p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur",
        tone === "success"
          ? "border-emerald-200 bg-emerald-50/95 text-emerald-950"
          : "border-slate-200 bg-white/95 text-slate-800",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {tone === "success" ? "Success" : "Action needed"}
          </p>
          <p className="mt-2 text-sm font-medium leading-6">{feedback.message}</p>
        </div>
      </div>

      {hasDetails ? (
        <ul className="mt-4 space-y-2 border-t border-slate-200/80 pt-4 text-sm">
          {feedback.details?.map((detail, index) => (
            <li key={`${detail}-${index}`} className="leading-6 text-slate-600">
              {detail}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<FeedbackToast[]>([]);
  const timeoutsRef = useRef(new Map<string, number>());

  const dismissFeedback = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timeoutId = timeoutsRef.current.get(id);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const showFeedback = useCallback(
    (feedback: Feedback, options: ShowFeedbackOptions = {}) => {
      const id = createToastId();
      const toast: FeedbackToast = {
        id,
        tone: options.tone ?? "error",
        message: feedback.message,
        details: feedback.details,
      };

      setToasts((current) => [...current, toast]);

      const durationMs = options.durationMs ?? 4500;

      if (durationMs > 0) {
        const timeoutId = window.setTimeout(() => {
          dismissFeedback(id);
        }, durationMs);

        timeoutsRef.current.set(id, timeoutId);
      }
    },
    [dismissFeedback],
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const value = useMemo<FeedbackContextValue>(() => ({ showFeedback }), [showFeedback]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-md flex-col gap-3 sm:right-6 sm:top-6 sm:w-full">
              {toasts.map((toast) => (
                <div key={toast.id} className="transition duration-200 ease-out">
                  <FeedbackToastView feedback={toast} tone={toast.tone} />
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }

  return context;
}
