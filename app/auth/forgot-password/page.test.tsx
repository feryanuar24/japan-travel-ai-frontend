import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
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

vi.mock("../../../lib/auth", () => ({
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

  it("renders the forgot password form", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByRole("heading", { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "/auth/login");
  });

  it("requests a reset link and redirects to the reset page", async () => {
    mockForgotPassword.mockResolvedValue({ message: "Reset link sent" });

    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "fery@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({ email: "fery@example.com" });
    });

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Reset link sent" })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByLabelText("Close"));
    expect(mockReplace).toHaveBeenCalledWith("/auth/reset-password?email=fery%40example.com");
  });
});