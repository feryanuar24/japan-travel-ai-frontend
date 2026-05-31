import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockUseAuth = vi.fn();
const mockRegister = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../../components/auth/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../../../lib/auth", () => ({
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

  it("renders the register form", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("registers a user and returns to login", async () => {
    mockRegister.mockResolvedValue({ message: "Account created" });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Fery Anuar" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "fery@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Secret@123" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "Fery Anuar",
        email: "fery@example.com",
        password: "Secret@123",
      });
    });

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Account created" })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByLabelText("Close"));
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });
});