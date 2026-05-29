import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockShowFeedback = vi.fn();
const mockSetAuthSession = vi.fn();
const mockUseAuth = vi.fn();
const mockLogin = vi.fn();

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

vi.mock("../../components/auth/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../../components/feedback/feedback", () => ({
  useFeedback: () => ({ showFeedback: mockShowFeedback }),
}));

vi.mock("../../lib/auth", () => ({
  authApi: {
    login: (...args: unknown[]) => mockLogin(...args),
  },
  getAuthFeedbackToast: (error: unknown) => ({
    message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    details: [],
  }),
  setAuthSession: (...args: unknown[]) => mockSetAuthSession(...args),
}));

import LoginPage from "./page";

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      session: null,
      isReady: true,
    });
  });

  it("renders the login form", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits credentials, saves the session, and redirects to the dashboard", async () => {
    mockLogin.mockResolvedValue({
      message: "Login successful",
      data: {
        token: "token-123",
        user: {
          _id: "user-1",
          name: "Fery Anuar",
          email: "fery@example.com",
          emailVerified: null,
          role: "admin",
        },
      },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "fery@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "fery@example.com",
        password: "secret123",
      });
    });

    expect(mockSetAuthSession).toHaveBeenCalledWith({
      token: "token-123",
      user: {
        _id: "user-1",
        name: "Fery Anuar",
        email: "fery@example.com",
        emailVerified: null,
        role: "admin",
      },
    });
    expect(mockShowFeedback).toHaveBeenCalledWith({ message: "Login successful" }, { tone: "success" });
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });
});
