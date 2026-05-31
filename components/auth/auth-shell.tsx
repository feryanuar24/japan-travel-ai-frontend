import Link from "next/link";

type AuthShellProps = {
  title: string;
  description: string;
  accent: string;
  children: React.ReactNode;
  footerText: string;
  footerHref: string;
  footerLabel: string;
};

export function AuthShell({
  title,
  description,
  accent,
  children,
  footerText,
  footerHref,
  footerLabel,
}: AuthShellProps) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-border bg-surface shadow-sm md:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col justify-between bg-primary-600 p-8 text-white sm:p-10 lg:p-12">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white">
              Japan Travel AI
            </span>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{accent}</p>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/80 sm:text-lg">{description}</p>
            </div>
          </div>
        </section>
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-xl space-y-8">
            {children}

            <div className="flex items-center justify-between gap-4 border-t border-border pt-6 text-sm text-text-secondary">
              <span>{footerText}</span>
              <Link href={footerHref} className="font-semibold text-primary transition hover:opacity-80">
                {footerLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}