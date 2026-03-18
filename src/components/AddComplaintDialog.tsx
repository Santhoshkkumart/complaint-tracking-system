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
        Submit Complaint
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-md">
              <motion.div 
                key="add-complaint-dialog"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white"
              >
                <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 px-5 py-3 flex justify-between items-center border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                      <MessageSquare size={16} />
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      Submit a Complaint
                    </h2>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[80vh]">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Tag size={14} /> Complaint Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., WiFi not working in Room 102"
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50 text-sm sm:text-base"
                      value={title}
                      maxLength={TITLE_MAX_CHARS}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-500 text-right font-mono">
                      {title.length}/{TITLE_MAX_CHARS}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Tag size={14} /> Category
                      </label>
                      <input
                        type="text"
                        placeholder="Hostel, Food, etc."
                        maxLength={30}
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50 text-sm sm:text-base"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Phone size={14} /> Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50 text-sm sm:text-base"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                      <AlertCircle size={14} /> Description
                    </label>
                    <textarea
                      placeholder="Detailed description of your issue..."
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50 resize-none text-sm sm:text-base"
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        const nextValue = e.target.value;
                        if (getWordCount(nextValue) <= DESCRIPTION_MAX_WORDS) {
                          setDescription(nextValue);
                        }
                      }}
                    />
                    <p className="text-[10px] text-slate-500 text-right font-mono">
                      {getWordCount(description)}/{DESCRIPTION_MAX_WORDS} words
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {["low", "medium", "high"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 px-2 sm:px-3 rounded-lg border transition-all text-[10px] sm:text-xs font-bold capitalize ${
                            priority === p
                              ? p === "low" ? "bg-green-500/20 border-green-500 text-green-400" :
                                p === "medium" ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" :
                                "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-[#020617] border-white/10 text-slate-500 hover:border-white/20"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 py-2.5 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all text-sm sm:text-base"
                    >
                      Discard
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-bold text-white transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Send size={16} className="sm:size-6" />
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default AddComplaintDialog;
