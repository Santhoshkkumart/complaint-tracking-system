function ComplaintDetail({ complaint, open, onClose }) {
  if (!open || !complaint) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold">{complaint.title}</h2>
      <p>{complaint.description}</p>
      <p className="text-sm">
        By: {complaint.submittedBy || complaint.userEmail || "Unknown"}
      </p>

      <button onClick={onClose} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">
        Close
      </button>
    </div>
  );
}

export default ComplaintDetail;
