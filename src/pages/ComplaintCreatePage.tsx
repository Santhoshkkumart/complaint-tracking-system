import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Send, Tag } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useComplaints } from "../hooks/useComplaints";
import ComplaintLetterFrame from "../components/ComplaintLetterFrame";

const TITLE_MAX_CHARS = 80;
const DESCRIPTION_MAX_WORDS = 200;

const getWordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

function ComplaintCreatePage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addComplaint } = useComplaints(user?.uid);

  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [mobile, setMobile] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.email) {
      alert("You must be signed in to submit a complaint.");
      return;
    }

    if (!title || !category || !description || !mobile) {
      alert("Please fill all fields, including your mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (getWordCount(description) > DESCRIPTION_MAX_WORDS) {
      alert(`Description must be ${DESCRIPTION_MAX_WORDS} words or less.`);
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);
      await addComplaint(
        {
          title,
          category,
          description,
          priority,
          mobile,
        },
        { uid: user.uid, email: user.email },
      );
      navigate(isAdmin ? "/dashboard" : "/user-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComplaintLetterFrame
      title="Submit a Complaint"
      subtitle="Write the issue as a formal complaint letter and submit it from a dedicated page."
      actions={
        <button
          type="button"
          onClick={() => navigate(isAdmin ? "/dashboard" : "/user-dashboard")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">To</p>
              <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                Complaint Resolution Desk
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <Tag size={13} /> Complaint Title
                </label>
                <input
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX_CHARS}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g., WiFi not working in Room 102"
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                />
                <p className="text-right text-[11px] text-slate-500">
                  {title.length}/{TITLE_MAX_CHARS}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <Mail size={13} /> Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Hostel, Food, Electricity..."
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Complaint Body
              </label>
              <textarea
                value={description}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (getWordCount(nextValue) <= DESCRIPTION_MAX_WORDS) {
                    setDescription(nextValue);
                  }
                }}
                rows={10}
                placeholder="Describe the issue in formal letter style with all relevant details."
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-amber-400"
              />
              <p className="text-right text-[11px] text-slate-500">
                {getWordCount(description)}/{DESCRIPTION_MAX_WORDS} words
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">From</p>
              <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                {user?.email || "Current user"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                <Phone size={13} /> Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Priority</p>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold capitalize transition ${
                      priority === level
                        ? level === "low"
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : level === "medium"
                            ? "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-stone-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-4 text-sm leading-7 text-slate-700">
              Dear Complaint Officer,
              <br />
              <br />
              I am writing to formally raise the following complaint. Please review the matter and
              take the necessary action at the earliest.
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(isAdmin ? "/dashboard" : "/user-dashboard")}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-amber-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
            {submitting ? "Submitting..." : "Submit complaint"}
          </button>
        </section>
      </form>
    </ComplaintLetterFrame>
  );
}

export default ComplaintCreatePage;
