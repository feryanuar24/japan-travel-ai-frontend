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
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-4xl border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col justify-between bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-amber-100">
              Japan Travel AI
            </span>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{accent}</p>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-xl space-y-8">
            {children}

            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <span>{footerText}</span>
              <Link href={footerHref} className="font-semibold text-slate-950 transition hover:opacity-70">
                {footerLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}