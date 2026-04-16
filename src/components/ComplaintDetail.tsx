import { CheckCircle2, Mail, Phone, StickyNote, X } from "lucide-react";

type ComplaintDetailProps = {
  complaint: any;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => Promise<void> | void;
  canResolve?: boolean;
};

const formatCreatedAt = (createdAt: any) => {
  if (!createdAt) return "Pending";
  if (typeof createdAt?.toDate === "function") {
    return createdAt.toDate().toLocaleString();
  }

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Pending" : date.toLocaleString();
};

function ComplaintDetail({ complaint, open, onClose, onStatusChange, canResolve = false }: ComplaintDetailProps) {
  if (!open || !complaint) return null;

  const isResolvedOrClosed = complaint.status === "resolved" || complaint.status === "closed";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-300/70 bg-[linear-gradient(180deg,rgba(255,248,240,0.98)_0%,rgba(248,239,225,0.98)_100%)] shadow-[0_30px_100px_rgba(15,23,42,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-stone-200/80 bg-[#fbf7ef] px-4 py-4 sm:px-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Complaint letter</p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {complaint.title || "Untitled Complaint"}
            </h2>
            <p className="text-xs text-slate-500">Read-only complaint review for user and admin.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="space-y-6 text-slate-900">
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">To</p>
                  <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                    Complaint Resolution Desk
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <StickyNote size={13} /> Subject
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                    {complaint.title || "Untitled Complaint"}
                  </h3>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-inner sm:p-6">
                  <p className="whitespace-pre-wrap text-sm leading-8 text-slate-800">
                    Dear Complaint Officer,
                    {"\n\n"}
                    {complaint.description || "No description available."}
                    {"\n\n"}
                    Kindly review the matter and take the necessary action. I am available through
                    the contact details listed below if any clarification is required.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">From</p>
                  <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                    {complaint.submittedBy || complaint.userEmail || "Unknown"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Status</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                      {complaint.status.replace("_", " ")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Priority</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                      {complaint.priority}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Category</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                      {complaint.category || "general"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Submitted</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {formatCreatedAt(complaint.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Contact</p>
                  <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                    <p className="flex items-center gap-2">
                      <Mail size={13} />
                      {complaint.userEmail || "No email available"}
                    </p>
                    <p className="mt-2 flex items-center gap-2">
                      <Phone size={13} />
                      {complaint.mobile || "No phone number"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-4 text-sm leading-7 text-slate-700">
                  Dear Complaint Officer,
                  <br />
                  <br />
                  This complaint can be reviewed and resolved from the dashboard when applicable.
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
              {!isResolvedOrClosed && canResolve && onStatusChange && (
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(complaint.id, "resolved");
                    onClose();
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-green-700"
                >
                  <CheckCircle2 size={16} />
                  Mark as resolved
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-50"
              >
                Close
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetail;
