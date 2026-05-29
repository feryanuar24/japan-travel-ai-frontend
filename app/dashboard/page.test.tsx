import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockClearSession = vi.fn();
const mockUseAuth = vi.fn();

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

import DashboardPage from "./page";

describe("Dashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      session: {
        token: "token-123",
        user: {
          _id: "user-1",
          name: "Fery Anuar",
          email: "fery@example.com",
          emailVerified: null,
          role: "admin",
        },
      },
      isReady: true,
      clearSession: mockClearSession,
    });
  });

  it("renders the admin navigation and user summary", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/signed in as/i)).toBeInTheDocument();
    expect(screen.getByText("fery@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /trip planner/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /content & modules/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
  });

  it("logs out and redirects to login", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(mockClearSession).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
