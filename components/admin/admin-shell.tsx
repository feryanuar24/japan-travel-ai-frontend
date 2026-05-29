import Link from "next/link";

type AdminNavItem = {
  label: string;
  href: string;
  description?: string;
  active?: boolean;
};

type AdminShellProps = {
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  navItems: AdminNavItem[];
  onLogout: () => void;
  children: React.ReactNode;
};

export function AdminShell({
  userName,
  userEmail,
  title,
  description,
  navItems,
  onLogout,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_48%,#e9eef5_100%)] px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-hidden rounded-4xl border border-white/70 bg-white/78 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="flex w-full flex-col">
          <header className="border-b border-slate-200/80 bg-white/80 px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                  Japan Travel AI
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Signed in as</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{userName}</p>
                  <p className="text-sm text-slate-600">{userEmail}</p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>

            <nav className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group min-w-44 rounded-2xl border px-4 py-3 text-left transition ${
                    item.active
                      ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.description ? (
                    <p className={`mt-1 text-xs leading-5 ${item.active ? "text-slate-300" : "text-slate-500"}`}>
                      {item.description}
                    </p>
                  ) : null}
                </Link>
              ))}
            </nav>
          </header>

          <section className="flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</section>
        </div>
      </div>
    </main>
  );
}