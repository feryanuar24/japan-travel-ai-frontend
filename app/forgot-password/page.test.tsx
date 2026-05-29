import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockShowFeedback = vi.fn();
const mockForgotPassword = vi.fn();

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../components/feedback/feedback", () => ({
  useFeedback: () => ({ showFeedback: mockShowFeedback }),
}));

vi.mock("../../lib/auth", () => ({
  authApi: {
    forgotPassword: (...args: unknown[]) => mockForgotPassword(...args),
  },
  getAuthFeedbackToast: (error: unknown) => ({
    message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    details: [],
  }),
}));

import ForgotPasswordPage from "./page";

describe("Forgot password page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the reset request form", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByRole("heading", { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("submits the email and redirects to reset password", async () => {
    mockForgotPassword.mockResolvedValue({ message: "Reset link sent" });

    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "fery@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({ email: "fery@example.com" });
    });

    expect(mockShowFeedback).toHaveBeenCalledWith({ message: "Reset link sent" }, { tone: "success" });
    expect(mockReplace).toHaveBeenCalledWith("/reset-password?email=fery%40example.com");
  });
});
