import type { ReactNode } from "react";

import { BeamsBackground } from "./ui/beams-background";

type ComplaintLetterFrameProps = {
  title: string;
  subtitle?: string;
  kicker?: string;
  actions?: ReactNode;
  children: ReactNode;
};

function ComplaintLetterFrame({
  title,
  subtitle,
  kicker = "Complaint letter",
  actions,
  children,
}: ComplaintLetterFrameProps) {
  return (
    <BeamsBackground
      intensity="medium"
      className="flex min-h-[100dvh] w-full max-w-full flex-col overflow-hidden text-white"
    >
      <div className="flex min-h-[100dvh] flex-col">
        <header className="shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{kicker}</p>
              <h1 className="mt-1 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
                {title}
              </h1>
              {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
            </div>

            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="rounded-[2rem] border border-stone-300/70 bg-[linear-gradient(180deg,rgba(255,248,240,0.98)_0%,rgba(248,239,225,0.98)_100%)] p-3 shadow-[0_30px_100px_rgba(15,23,42,0.35)] sm:p-5">
              <div className="rounded-[1.5rem] border border-stone-200/80 bg-[#fbf7ef] px-4 py-5 text-slate-900 shadow-inner sm:px-8 sm:py-8">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </BeamsBackground>
  );
}

export default ComplaintLetterFrame;
