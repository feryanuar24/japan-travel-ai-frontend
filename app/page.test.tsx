import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import Home from "./page";

describe("Home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the main landing copy and navigation links", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /sign-in flow built for trip planning, account recovery, and protected access/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /open login/i })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /create account/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
