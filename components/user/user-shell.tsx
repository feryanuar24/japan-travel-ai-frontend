import Link from "next/link";
import { Button } from '@/components/ui/Button'

type UserNavItem = {
  label: string;
  href: string;
  description?: string;
  active?: boolean;
};

type UserShellProps = {
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  navItems: UserNavItem[];
  onLogout: () => void;
  children: React.ReactNode;
};

export function UserShell({
  userName,
  userEmail,
  title,
  description,
  navItems,
  onLogout,
  children,
}: UserShellProps) {
  return (
    <main className="min-h-screen px-4 py-4 text-text sm:px-6 lg:px-8 bg-bg">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex w-full flex-col">
          <header className="border-b border-border px-5 py-4 sm:px-6 lg:px-8 bg-surface">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                  Japan Travel AI
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-md border border-border bg-surface px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">Signed in as</p>
                  <p className="mt-1 text-sm font-semibold text-text">{userName}</p>
                  <p className="text-sm text-text-secondary">{userEmail}</p>
                </div>

                <Button type="button" onClick={onLogout} variant="danger" className="shrink-0">
                  Logout
                </Button>
              </div>
            </div>

            <nav aria-label="User portal modules" className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`group min-w-44 rounded-md border px-4 py-3 text-left transition ${
                    item.active
                      ? "border-primary bg-primary text-white shadow"
                      : "border-border bg-surface text-text hover:border-border hover:bg-(--color-bg)"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.description ? (
                    <p className={`mt-1 text-xs leading-5 ${item.active ? "text-white/80" : "text-text-secondary"}`}>
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