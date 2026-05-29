import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-14 sm:px-8 lg:px-10">
        <section className="grid gap-8 overflow-hidden rounded-4xl border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-sm font-medium text-amber-900">
              Japan Travel AI
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Sign-in flow built for trip planning, account recovery, and protected access.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Use the authentication routes to register users, log them in, recover passwords,
                and guide verified users into the dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
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
