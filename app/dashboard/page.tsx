"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../components/admin/admin-shell";
import { useAuth } from "../../components/auth/auth-provider";

export default function DashboardPage() {
  const router = useRouter();
  const { session, clearSession, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !session) {
      router.replace("/login");
      return;
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
    clearSession();
    router.replace("/login");
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Checking session...
      </main>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      description: "Quick View and Main Activity.",
      active: true,
    },
    {
      label: "Trip Planner",
      href: "/dashboard",
      description: "Module for trip planning, itineraries, and recommendations.",
    },
    {
      label: "Content & Modules",
      href: "/dashboard",
      description: "Module for managing content and features.",
    },
    {
      label: "Settings",
      href: "/dashboard",
      description: "Account configuration, access, and system preferences.",
    },
  ];

  return (
    <AdminShell
      userName={session.user.name}
      userEmail={session.user.email}
      title="Dashboard"
      description="Welcome to this application, where you can navigate the app's modules, review your activity data, and access the tools that help your to travel smarter."
      navItems={navItems}
      onLogout={handleLogout}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Welcome back
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Build the admin workspace module by module.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              This dashboard is designed as a central navigation hub for an app with many menus,
              pages, and user activity records. Each navbar item can later point to a dedicated
              module without changing the main structure.
            </p>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Quick actions
            </p>
            <div className="mt-4 space-y-3">
              {[
                "Review recent user activity",
                "Manage travel content modules",
                "Update navigation and access rules",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}