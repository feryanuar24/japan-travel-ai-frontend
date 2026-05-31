"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserShell } from "../../../components/user/user-shell";
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from "../../../components/auth/auth-provider";
import { clearAuthSession, isAdminRole } from "../../../lib/auth";

export default function WorkspacePage() {
  const router = useRouter();
  const { session, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !session) {
      router.replace("/auth/login");
      return;
    }
    if (isReady && session && isAdminRole(session.user.role)) {
      router.replace("/admin");
    }
  }, [isReady, router, session]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Checking session...
      </main>
    );
  }

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/auth/login");
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Checking session...
      </main>
    );
  }

  if (isAdminRole(session.user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Redirecting to admin console...
      </main>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/workspace",
      description: "Home base for your travel tools and saved activity.",
      active: true,
    },
    {
      label: "Itinerary Builder",
      href: "/workspace",
      description: "Draft day-by-day travel plans with flexible stops.",
    },
    {
      label: "Budget Estimator",
      href: "/workspace",
      description: "Estimate costs for stays, food, transport, and activities.",
    },
    {
      label: "Smart Place Recommend",
      href: "/workspace",
      description: "Discover places matched to your interests and trip style.",
    },
    {
      label: "Transport Plan",
      href: "/workspace",
      description: "Plan rail, bus, and transfer routes across your trip.",
    },
    {
      label: "Chat AI Assistant",
      href: "/workspace",
      description: "Ask questions and refine your trip in real time.",
    },
  ];

  return (
    <UserShell
      userName={session.user.name}
      userEmail={session.user.email}
      title="Travel Workspace"
      description="A user portal for planning trips, tracking estimates, and accessing Japan travel modules. Admin operations live in a separate console."
      navItems={navItems}
      onLogout={handleLogout}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Welcome back</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Build your trip workspace module by module.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-text-secondary">
              This portal is designed as a central hub for itinerary planning, budget estimates,
              place recommendations, transport routes, and an AI assistant. Each module can grow
              into its own page without changing the main navigation model.
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="primary">Start itinerary</Button>
              <Button variant="secondary">Estimate budget</Button>
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card title="Quick actions">
            <div className="mt-2 space-y-3">
              {[
                "Continue planning your next Japan trip",
                "Open budget and transport tools",
                "Launch AI chat for trip questions",
              ].map((item) => (
                <div key={item} className="rounded-md border border-border bg-(--color-bg) px-4 py-3 text-sm text-text-secondary">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </UserShell>
  );
}