function ComplaintDetail({ complaint, open, onClose }) {
  if (!open || !complaint) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold">{complaint.title}</h2>
      <p>{complaint.description}</p>
      <p className="text-sm">By: {complaint.submittedBy}</p>

      <button onClick={onClose} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">
        Close
      </button>
    </div>
  );
}

export default ComplaintDetail;
