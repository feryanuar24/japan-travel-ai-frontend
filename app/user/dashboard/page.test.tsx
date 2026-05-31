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

vi.mock("../../../components/auth/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}));

import WorkspacePage from "./page";

describe("Travel workspace page", () => {
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
          role: "user",
        },
      },
      isReady: true,
      clearSession: mockClearSession,
    });
  });

  it("renders the user portal navigation and summary", () => {
    render(<WorkspacePage />);

    expect(screen.getByRole("heading", { name: /travel workspace/i })).toBeInTheDocument();
    expect(screen.getByText(/signed in as/i)).toBeInTheDocument();
    expect(screen.getByText("fery@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /itinerary builder/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /budget estimator/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /smart place recommend/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /transport plan/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chat ai assistant/i })).toBeInTheDocument();
  });

  it("logs out and redirects to login", () => {
    render(<WorkspacePage />);

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    expect(mockClearSession).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });
});