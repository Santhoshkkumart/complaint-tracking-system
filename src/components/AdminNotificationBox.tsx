import { Bell, Eye, Trash2 } from "lucide-react";

import type { Complaint } from "@/hooks/useComplaints";

type AdminNotificationBoxProps = {
  notifications: Complaint[];
  onView: (complaint: Complaint) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
};

const formatTime = (createdAt: Complaint["createdAt"]) => {
  if (!createdAt) {
    return "Just now";
  }

  if (typeof createdAt?.toDate === "function") {
    return createdAt.toDate().toLocaleString();
  }

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString();
};

function AdminNotificationBox({
  notifications,
  onView,
  onDismiss,
  onClearAll,
}: AdminNotificationBoxProps) {
  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 shadow-lg backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 text-cyan-200">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
              Live Alerts
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">New complaint notifications</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex min-h-9 items-center rounded-full border border-cyan-300/20 bg-cyan-400/15 px-3 text-sm font-semibold text-cyan-100">
            {notifications.length} new
          </span>
          <button
            type="button"
            onClick={onClearAll}
            disabled={!notifications.length}
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.length ? (
          notifications.map((complaint) => (
            <article
              key={complaint.id}
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-white">{complaint.title}</h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                      {complaint.category || "general"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    From {complaint.userEmail || "unknown"} • {formatTime(complaint.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(complaint)}
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-3 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onDismiss(complaint.id)}
                    className="inline-flex min-h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 px-4 py-8 text-center text-sm text-slate-300">
            No new complaints right now. New submissions will appear here in real time.
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminNotificationBox;
