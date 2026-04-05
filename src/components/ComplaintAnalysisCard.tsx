import { useMemo } from "react";
import { PieChart as PieChartIcon } from "lucide-react";

import type { Complaint } from "@/hooks/useComplaints";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
  Complaint["status"],
  { label: string; color: string; ring: string }
> = {
  open: {
    label: "Open",
    color: "#f87171",
    ring: "border-red-400/30 bg-red-500/10 text-red-200",
  },
  in_progress: {
    label: "In Progress",
    color: "#fbbf24",
    ring: "border-yellow-400/30 bg-yellow-500/10 text-yellow-100",
  },
  resolved: {
    label: "Resolved",
    color: "#4ade80",
    ring: "border-green-400/30 bg-green-500/10 text-green-100",
  },
  closed: {
    label: "Closed",
    color: "#cbd5e1",
    ring: "border-slate-400/30 bg-slate-500/10 text-slate-100",
  },
};

const CIRCUMFERENCE = 2 * Math.PI * 72;

function formatPercent(value: number, total: number) {
  if (!total) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

function ComplaintAnalysisCard({ complaints }: { complaints: Complaint[] }) {
  const analysis = useMemo(() => {
    const counts = complaints.reduce(
      (acc, complaint) => {
        acc[complaint.status] += 1;
        return acc;
      },
      {
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
      } satisfies Record<Complaint["status"], number>,
    );

    const total = complaints.length;
    let offset = 0;

    const segments = (Object.keys(STATUS_META) as Complaint["status"][]).map((status) => {
      const count = counts[status];
      const length = total ? (count / total) * CIRCUMFERENCE : 0;
      const segment = {
        status,
        count,
        length,
        offset,
        ...STATUS_META[status],
      };
      offset += length;
      return segment;
    });

    return { counts, total, segments };
  }, [complaints]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Complaint Analysis
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Status breakdown</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          <PieChartIcon className="h-4 w-4 text-purple-300" />
          {analysis.total} total
        </div>
      </div>

      {analysis.total === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-6 text-center text-sm text-slate-400">
          No complaint data yet. The pie chart will populate as complaints are submitted.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="24"
                />
                {analysis.segments.map((segment) =>
                  segment.count > 0 ? (
                    <circle
                      key={segment.status}
                      cx="100"
                      cy="100"
                      r="72"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                      strokeDashoffset={-segment.offset}
                      className="transition-[stroke-dasharray,stroke-dashoffset] duration-500"
                    />
                  ) : null,
                )}
              </svg>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full text-center">
                <p className="text-4xl font-black tracking-tight text-white">{analysis.total}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">complaints</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(STATUS_META) as Complaint["status"][]).map((status) => {
              const meta = STATUS_META[status];
              const count = analysis.counts[status];

              return (
                <div key={status} className={cn("rounded-2xl border px-4 py-4", meta.ring)}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{meta.label}</p>
                      <p className="mt-1 text-xs text-slate-300">
                        {formatPercent(count, analysis.total)} of all complaints
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default ComplaintAnalysisCard;
