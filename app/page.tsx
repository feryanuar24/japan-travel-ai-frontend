"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/auth/auth-provider";
import { getHomeRouteForRole } from "../lib/auth";

export default function Home() {
  const router = useRouter();
  const { session, isReady } = useAuth();

  useEffect(() => {
    if (!isReady || !session) {
      return;
    }

    router.replace(getHomeRouteForRole(session.user.role));
  }, [isReady, router, session]);

  if (isReady && session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-slate-600">
        Redirecting to dashboard...
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex flex-1 flex-col justify-center py-14">
        <section className="grid gap-8 overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
                AI travel planning for Japan, from itinerary building to transport and chat support.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
                Generate smart itineraries, estimate your budget, discover recommended places,
                plan transport routes, and ask AI chat for instant trip guidance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Open Login
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-text transition hover:bg-bg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
