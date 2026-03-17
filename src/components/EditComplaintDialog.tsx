import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageSquare, Phone, Tag, AlertCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ComplaintInput = {
  title: string;
  category: string;
  description: string;
  priority: string;
  mobile?: string;
};

type EditComplaintDialogProps = {
  complaint: (ComplaintInput & { id: string }) | null;
  open: boolean;
  onClose: () => void;
  onSave: (complaint: ComplaintInput & { id: string }) => Promise<void>;
};

function EditComplaintDialog({
  complaint,
  open,
  onClose,
  onSave,
}: EditComplaintDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (!complaint) return;
    setTitle(complaint.title || "");
    setCategory(complaint.category || "");
    setDescription(complaint.description || "");
    setPriority(complaint.priority || "low");
    setMobile(complaint.mobile || "");
  }, [complaint]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!complaint) return;

    if (!title || !category || !description || !mobile) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    await onSave({
      id: complaint.id,
      title,
      category,
      description,
      priority,
      mobile,
    });
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#0b1220] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white"
          >
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 px-6 py-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Edit Complaint
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[80vh]">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Tag size={14} /> Title
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 sm:p-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50 text-sm sm:text-base"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Tag size={14} /> Category
                  </label>
                  <input
                    type="text"
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
                  className="w-full p-2.5 sm:p-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50 resize-none text-sm sm:text-base"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-bold text-white transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Save size={16} className="sm:size-18" />
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default EditComplaintDialog;
