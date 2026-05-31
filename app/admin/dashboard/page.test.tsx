import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockUseAuth = vi.fn();
const mockClearAuthSession = vi.fn();

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
  clearAuthSession: (...args: unknown[]) => mockClearAuthSession(...args),
  isAdminRole: (role: string | null | undefined) => role === "admin",
}));

import AdminPage from "./page";

describe("Admin dashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  it("renders the admin console and navigation", () => {
    render(<AdminPage />);

    expect(screen.getByRole("heading", { name: /admin console/i })).toBeInTheDocument();
    expect(screen.getByText(/admin access/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /user access/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /content control/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /operations/i })).toBeInTheDocument();
  });

  it("logs out and returns to login", () => {
    render(<AdminPage />);

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(mockClearAuthSession).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });

  it("redirects non-admin sessions to the workspace", async () => {
    mockUseAuth.mockReturnValue({
      session: {
        token: "token-user",
        user: {
          _id: "user-1",
          name: "Fery Anuar",
          email: "fery@example.com",
          emailVerified: null,
          role: "user",
        },
      },
      isReady: true,
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/workspace");
    });
  });
});