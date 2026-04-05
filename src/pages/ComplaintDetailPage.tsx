import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, Mail, Phone, StickyNote } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Complaint, useComplaints } from "../hooks/useComplaints";
import ComplaintLetterFrame from "../components/ComplaintLetterFrame";

const formatCreatedAt = (createdAt: Complaint["createdAt"]) => {
  if (!createdAt) return "Pending";
  if (typeof createdAt?.toDate === "function") {
    return createdAt.toDate().toLocaleString();
  }

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Pending" : date.toLocaleString();
};

function ComplaintDetailPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { complaints, loading, updateComplaintStatus } = useComplaints(user?.uid, true);

  const complaintFromState = (location.state as { complaint?: Complaint } | null)?.complaint;
  const complaint = useMemo(
    () => complaintFromState ?? complaints.find((item) => item.id === id) ?? null,
    [complaintFromState, complaints, id],
  );

  const handleResolve = async () => {
    if (!complaint) {
      return;
    }

    try {
      await updateComplaintStatus(complaint.id, "resolved");
    } catch (error) {
      console.error(error);
      alert("Failed to update complaint status.");
    }
  };

  return (
    <ComplaintLetterFrame
      title="Complaint Detail"
      subtitle="A complaint-letter styled view for reviewing the full submission."
      actions={
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </button>
      }
    >
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-amber-500" />
        </div>
      ) : !complaint ? (
        <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-6 text-slate-700">
          Complaint not found.
        </div>
      ) : (
        <div className="space-y-8">
          <section className="flex flex-col gap-6 border-b border-stone-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Date</p>
                <p className="text-sm text-slate-700">{formatCreatedAt(complaint.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">To</p>
                <p className="text-sm text-slate-700">Complaint Resolution Desk</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">From</p>
                <p className="text-sm text-slate-700">
                  {complaint.submittedBy || complaint.userEmail || "Unknown"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[300px]">
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
                <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Reference</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{complaint.id}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                <StickyNote size={13} /> Subject
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {complaint.title || "Untitled Complaint"}
              </h2>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-inner sm:p-6">
              <p className="whitespace-pre-wrap text-sm leading-8 text-slate-800">
                Dear Complaint Officer,
                {"\n\n"}
                {complaint.description || "No description available."}
                {"\n\n"}
                Kindly review the issue and take the necessary action. I am available through the
                contact details listed below if any clarification is required.
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">
                <Mail size={13} /> Email
              </p>
              <p className="mt-2 break-words text-sm text-slate-800">
                {complaint.userEmail || "No email available"}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">
                <Phone size={13} /> Mobile
              </p>
              <p className="mt-2 text-sm text-slate-800">{complaint.mobile || "No phone number"}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">
                <Clock3 size={13} /> Submitted
              </p>
              <p className="mt-2 text-sm text-slate-800">{formatCreatedAt(complaint.createdAt)}</p>
            </div>
          </section>

          <section className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
            {complaint.status !== "resolved" && complaint.status !== "closed" && (
              <button
                type="button"
                onClick={handleResolve}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-green-700"
              >
                <CheckCircle2 size={16} />
                Mark as resolved
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-50"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </ComplaintLetterFrame>
  );
}

export default ComplaintDetailPage;
