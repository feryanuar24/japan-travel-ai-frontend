"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../../components/admin/admin-shell";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../components/auth/auth-provider";
import { clearAuthSession, isAdminRole } from "../../../lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !session) {
      router.replace("/auth/login");
      return;
    }

    if (isReady && session && !isAdminRole(session.user.role)) {
      router.replace("/workspace");
    }
  }, [isReady, router, session]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Checking session...
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Checking session...
      </main>
    );
  }

  if (!isAdminRole(session.user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Redirecting to workspace...
      </main>
    );
  }

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/auth/login");
  };

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      description: "Monitor platform health, users, and system status.",
      active: true,
    },
    {
      label: "User Access",
      href: "/admin",
      description: "Review accounts, permissions, and access flows.",
    },
    {
      label: "Content Control",
      href: "/admin",
      description: "Manage travel data, templates, and system content.",
    },
    {
      label: "Operations",
      href: "/admin",
      description: "Track moderation, audits, and admin workflows.",
    },
  ];

  return (
    <AdminShell
      userName={session.user.name}
      userEmail={session.user.email}
      title="Admin Console"
      description="A separate surface for operations, moderation, and system management. User travel planning stays in the workspace area."
      navItems={navItems}
      onLogout={handleLogout}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin access</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Manage platform operations separately from the user portal.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-text-secondary">
              This area is reserved for admin workflows such as access review, content moderation,
              and operational monitoring.
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="primary">Review users</Button>
              <Button variant="secondary">Open audit log</Button>
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card title="Admin actions">
            <div className="mt-2 space-y-3">
              {[
                "Check account access requests",
                "Review system content",
                "Monitor moderation queue",
              ].map((item) => (
                <div key={item} className="rounded-md border border-border bg-(--color-bg) px-4 py-3 text-sm text-text-secondary">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AdminShell>
  );
}