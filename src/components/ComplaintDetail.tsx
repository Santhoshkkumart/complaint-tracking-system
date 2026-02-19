type ComplaintDetailProps = {
  complaint: any;
  open: boolean;
  onClose: () => void;
};

function ComplaintDetail({ complaint, open, onClose }: ComplaintDetailProps) {
  if (!open || !complaint) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#020617] text-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-cyan-300">
          {complaint.title || "Untitled Complaint"}
        </h2>
        <p className="mt-4 text-slate-200 whitespace-pre-wrap">
          {complaint.description || "No description available."}
        </p>
        <p className="text-sm text-slate-400 mt-4">
          By: {complaint.submittedBy || complaint.userEmail || "Unknown"}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetail;
