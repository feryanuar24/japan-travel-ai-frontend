import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
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

vi.mock("../../../components/auth/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../../../lib/auth", () => ({
  authApi: {
    login: (...args: unknown[]) => mockLogin(...args),
  },
  getHomeRouteForRole: (role: string | null | undefined) => (role === "admin" ? "/admin" : "/workspace"),
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

  it("submits credentials, saves the session, and redirects to the workspace", async () => {
    mockLogin.mockResolvedValue({
      message: "Login successful",
      data: {
        token: "token-123",
        user: {
          _id: "user-1",
          name: "Fery Anuar",
          email: "fery@example.com",
          emailVerified: null,
          role: "user",
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
        role: "user",
      },
    });

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Login successful" })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByLabelText("Close"));
    expect(mockReplace).toHaveBeenCalledWith("/workspace");
  });

  it("redirects admin sessions to the admin console", async () => {
    mockUseAuth.mockReturnValue({
      session: {
        token: "token-admin",
        user: {
          _id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          emailVerified: null,
          role: "admin",
        },
      },
      isReady: true,
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin");
    });
  });
});