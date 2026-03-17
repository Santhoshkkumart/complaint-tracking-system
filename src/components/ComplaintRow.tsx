import { Complaint } from "../hooks/useComplaints";

type ComplaintRowProps = {
  complaint: Complaint;
  onStatusChange: (id: string, status: Complaint["status"]) => void;
  onPreview: (complaint: Complaint, transient?: boolean) => void;
  onDelete: (id: string) => void;
};

function ComplaintRow({
  complaint,
  onStatusChange,
  onPreview,
  onDelete,
}: ComplaintRowProps) {
  const getCreatedAtDate = () => {
    if (!complaint.createdAt) return "—";
    if (complaint.createdAt.toDate) {
      return complaint.createdAt.toDate().toLocaleDateString();
    }
    return new Date(complaint.createdAt).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    if (status === "open") return "bg-red-500/20 text-red-400";
    if (status === "in_progress") return "bg-yellow-500/20 text-yellow-400";
    if (status === "resolved") return "bg-green-500/20 text-green-400";
    return "bg-cyan-500/20 text-cyan-400";
  };

  return (
    <tr
      className="border-b border-white/10 hover:bg-white/5 transition cursor-pointer"
      onTouchStart={() => onPreview(complaint, true)}
      onClick={() => onPreview(complaint)}
    >
      <td className="px-6 py-4 font-mono text-sm text-slate-400">
        {complaint.id?.slice(0, 6)}
      </td>

      <td className="px-6 py-4 font-semibold">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(complaint);
          }}
          className="text-left hover:text-cyan-300 transition"
          title="Preview complaint details"
        >
          {complaint.title}
        </button>
      </td>

      <td className="px-6 py-4 text-slate-300">
        {complaint.category || "general"}
      </td>

      <td className="px-6 py-4">
        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg text-xs capitalize">
          {complaint.priority || "medium"}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(complaint.status)}`}>
          {complaint.status.replace("_", " ")}
        </span>
      </td>

      <td className="px-6 py-4 text-slate-400">
        {getCreatedAtDate()}
      </td>

      <td className="px-6 py-4 flex gap-2">
        {complaint.status !== "resolved" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(complaint.id, "resolved");
            }}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
          >
            Resolve
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(complaint.id);
          }}
          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all border border-red-600/30"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ComplaintRow;
