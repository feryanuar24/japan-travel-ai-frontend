import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockShowFeedback = vi.fn();
const mockResetPassword = vi.fn();
const mockGetSearchParam = vi.fn();

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({ get: mockGetSearchParam }),
}));

vi.mock("../../components/feedback/feedback", () => ({
  useFeedback: () => ({ showFeedback: mockShowFeedback }),
}));

vi.mock("../../lib/auth", () => ({
  authApi: {
    resetPassword: (...args: unknown[]) => mockResetPassword(...args),
  },
  getAuthFeedbackToast: (error: unknown) => ({
    message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    details: [],
  }),
}));

import ResetPasswordPage from "./page";

describe("Reset password page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSearchParam.mockImplementation((key: string) => (key === "email" ? "fery@example.com" : null));
  });

  it("renders the reset form and shows the email hint", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByRole("heading", { name: /set a new password/i })).toBeInTheDocument();
    expect(screen.getByText(/reset link requested for fery@example.com/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reset token/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  it("submits the token and password, then redirects to login", async () => {
    mockResetPassword.mockResolvedValue({ message: "Password updated" });

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByLabelText(/reset token/i), { target: { value: "token-123" } });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        token: "token-123",
        password: "secret123",
      });
    });

    expect(mockShowFeedback).toHaveBeenCalledWith({ message: "Password updated" }, { tone: "success" });
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
