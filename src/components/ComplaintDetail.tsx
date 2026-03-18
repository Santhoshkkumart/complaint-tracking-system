import { X, CheckCircle } from "lucide-react";

type ComplaintDetailProps = {
  complaint: any;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => Promise<void> | void;
};

function ComplaintDetail({ complaint, open, onClose, onStatusChange }: ComplaintDetailProps) {
  if (!open || !complaint) return null;

  const isResolvedOrClosed = complaint.status === "resolved" || complaint.status === "closed";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0b1220] p-5 text-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 leading-tight">
            {complaint.title || "Untitled Complaint"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white sm:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Description</h3>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {complaint.description || "No description available."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Submitted By</h3>
              <p className="text-sm text-slate-300">
                {complaint.submittedBy || complaint.userEmail || "Unknown"}
              </p>
            </div>
            {complaint.mobile && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Contact</h3>
                <p className="text-sm text-purple-400 font-mono">
                  {complaint.mobile}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            {!isResolvedOrClosed && onStatusChange && (
              <button
                onClick={() => {
                  onStatusChange(complaint.id, "resolved");
                  onClose();
                }}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              >
                <CheckCircle size={18} />
                Mark as Resolved
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetail;
