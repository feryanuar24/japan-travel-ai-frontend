import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockShowFeedback = vi.fn();
const mockUseAuth = vi.fn();
const mockRegister = vi.fn();

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
    register: (...args: unknown[]) => mockRegister(...args),
  },
  getAuthFeedbackToast: (error: unknown) => ({
    message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    details: [],
  }),
}));

import RegisterPage from "./page";

describe("Register page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      session: null,
      isReady: true,
    });
  });

  it("renders the registration form", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("submits registration data and redirects to login", async () => {
    mockRegister.mockResolvedValue({ message: "Registration successful" });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "Fery Anuar" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "fery@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "Fery Anuar",
        email: "fery@example.com",
        password: "secret123",
      });
    });

    expect(mockShowFeedback).toHaveBeenCalledWith(
      { message: "Registration successful" },
      { tone: "success" },
    );
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
