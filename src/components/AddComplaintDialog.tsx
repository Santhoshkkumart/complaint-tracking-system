import { useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageSquare, Phone, Tag, AlertCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TITLE_MAX_CHARS = 80;
const DESCRIPTION_MAX_WORDS = 200;

const getWordCount = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

function AddComplaintDialog({ onAdd }: { onAdd: (data: any) => Promise<void> | void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [mobile, setMobile] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      await onAdd({
        title,
        category,
        description,
        priority,
        mobile,
      });

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setPriority("low");
      setMobile("");

      setOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openDialog = () => {
    if (open) return;
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openDialog();
        }}
        className="relative z-[50] inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-600 hover:to-indigo-700 hover:scale-105 active:scale-95"
        aria-label="Open complaint form"
      >
        <MessageSquare size={14} />
        Add a Complaint
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
              <motion.div
                key="add-complaint-dialog"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-300/70 bg-[linear-gradient(180deg,rgba(255,248,240,0.98)_0%,rgba(248,239,225,0.98)_100%)] shadow-[0_30px_100px_rgba(15,23,42,0.4)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-stone-200/80 bg-[#fbf7ef] px-4 py-4 sm:px-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Complaint letter</p>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Submit a Complaint
                    </h2>
                    <p className="text-xs text-slate-500">
                      Write the issue in the same format used across user and admin complaint screens.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                  <div className="space-y-6 text-slate-900">
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
                              placeholder="e.g., WiFi not working in Room 102"
                              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                              value={title}
                              maxLength={TITLE_MAX_CHARS}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                            <p className="text-right text-[11px] text-slate-500">
                              {title.length}/{TITLE_MAX_CHARS}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                              <Tag size={13} /> Category
                            </label>
                            <input
                              type="text"
                              placeholder="Hostel, Food, Electricity..."
                              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            <AlertCircle size={13} /> Complaint Body
                          </label>
                          <textarea
                            placeholder="Describe the issue in formal letter style with all relevant details."
                            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-amber-400"
                            rows={10}
                            value={description}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              if (getWordCount(nextValue) <= DESCRIPTION_MAX_WORDS) {
                                setDescription(nextValue);
                              }
                            }}
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
                            Current user
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            <Phone size={13} /> Mobile Number
                          </label>
                          <input
                            type="tel"
                            placeholder="10-digit number"
                            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
                          I am writing to formally raise the following complaint. Please review the
                          matter and take the necessary action at the earliest.
                        </div>
                      </div>
                    </section>

                    <section className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
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
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export default AddComplaintDialog;
