import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, Download, Mail, Phone, StickyNote } from "lucide-react";

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

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const makeSafeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "complaint";

const buildComplaintDocument = (complaint: Complaint) => {
  const title = escapeHtml(complaint.title || "Untitled Complaint");
  const category = escapeHtml(complaint.category || "general");
  const priority = escapeHtml(complaint.priority || "low");
  const status = escapeHtml(complaint.status.replace("_", " "));
  const reference = escapeHtml(complaint.id);
  const email = escapeHtml(complaint.userEmail || "No email available");
  const mobile = escapeHtml(complaint.mobile || "No phone number");
  const submittedBy = escapeHtml(complaint.submittedBy || complaint.userEmail || "Unknown");
  const submittedAt = escapeHtml(formatCreatedAt(complaint.createdAt));
  const description = escapeHtml(complaint.description || "No description available.").replace(
    /\n/g,
    "<br />",
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - ResolveX Complaint</title>
    <style>
      body {
        margin: 0;
        padding: 32px;
        background: #f5efe4;
        color: #1f2937;
        font-family: Arial, Helvetica, sans-serif;
      }
      .page {
        max-width: 820px;
        margin: 0 auto;
        background: #fffaf1;
        border: 1px solid #e7dcc9;
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12);
      }
      .kicker {
        margin: 0 0 12px;
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: #8b6b42;
      }
      h1 {
        margin: 0 0 24px;
        font-size: 32px;
        line-height: 1.2;
        color: #111827;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .card {
        border: 1px solid #e5dccd;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.8);
        padding: 14px 16px;
      }
      .label {
        margin: 0 0 8px;
        font-size: 10px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: #7c7c7c;
      }
      .value {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        white-space: pre-wrap;
      }
      .subject {
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 700;
      }
      .body {
        border: 1px solid #e5dccd;
        border-radius: 24px;
        background: #fff;
        padding: 20px 22px;
        line-height: 2;
        white-space: normal;
      }
      .body p {
        margin: 0;
      }
      .footer {
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px solid #e5dccd;
        font-size: 12px;
        color: #6b7280;
      }
      @media print {
        body {
          background: #fff;
          padding: 0;
        }
        .page {
          box-shadow: none;
          border-radius: 0;
          border: 0;
          max-width: none;
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <article class="page">
      <p class="kicker">ResolveX complaint form</p>
      <h1>${title}</h1>

      <section class="grid">
        <div class="card">
          <p class="label">To</p>
          <p class="value">Complaint Resolution Desk</p>
        </div>
        <div class="card">
          <p class="label">From</p>
          <p class="value">${submittedBy}</p>
        </div>
        <div class="card">
          <p class="label">Submitted</p>
          <p class="value">${submittedAt}</p>
        </div>
        <div class="card">
          <p class="label">Reference</p>
          <p class="value">${reference}</p>
        </div>
        <div class="card">
          <p class="label">Category</p>
          <p class="value">${category}</p>
        </div>
        <div class="card">
          <p class="label">Priority / Status</p>
          <p class="value">${priority} / ${status}</p>
        </div>
      </section>

      <section>
        <p class="label">Subject</p>
        <h2 class="subject">${title}</h2>
        <div class="body">
          <p>Dear Complaint Officer,</p>
          <p>${description}</p>
          <p>Kindly review the matter and take the necessary action. I am available through the contact details listed below if any clarification is required.</p>
        </div>
      </section>

      <section class="grid" style="margin-top: 24px;">
        <div class="card">
          <p class="label">Email</p>
          <p class="value">${email}</p>
        </div>
        <div class="card">
          <p class="label">Mobile</p>
          <p class="value">${mobile}</p>
        </div>
      </section>

      <div class="footer">
        Generated by ResolveX. Complaint ID: ${reference}
      </div>
    </article>
  </body>
</html>`;
};

const downloadComplaintForm = (complaint: Complaint) => {
  const html = buildComplaintDocument(complaint);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${makeSafeFileName(complaint.title)}-complaint.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

function ComplaintDetailPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { complaints, loading, updateComplaintStatus } = useComplaints(user?.uid, isAdmin);

  const complaintFromState = (location.state as { complaint?: Complaint } | null)?.complaint;
  const complaint = useMemo(
    () => complaintFromState ?? complaints.find((item) => item.id === id) ?? null,
    [complaintFromState, complaints, id],
  );
  const canResolveComplaint =
    isAdmin && complaint && complaint.status !== "resolved" && complaint.status !== "closed";

  const handleResolve = async () => {
    if (!complaint || !isAdmin) {
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
        <>
          {complaint && (
            <button
              type="button"
              onClick={() => downloadComplaintForm(complaint)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15"
            >
              <Download size={14} />
              Download form
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(isAdmin ? "/dashboard" : "/user-dashboard")}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15"
          >
            <ArrowLeft size={14} />
            {isAdmin ? "Back to dashboard" : "Back to user dashboard"}
          </button>
        </>
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
            {canResolveComplaint && (
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
              onClick={() => navigate(isAdmin ? "/dashboard" : "/user-dashboard")}
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
