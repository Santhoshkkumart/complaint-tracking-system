type ComplaintRowProps = {
  complaint: any;
  onStatusChange: (id: string, status: string) => void;
  onPreview: (complaint: any, transient?: boolean) => void;
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

  return (
    <tr
      className="border-b border-white/10 hover:bg-white/5 transition"
      onTouchStart={() => onPreview(complaint, true)}
      onClick={() => onPreview(complaint)}
    >

  <td className="px-6 py-4 font-mono text-sm text-slate-400">
    {complaint.id?.slice(0,6)}
  </td>

  <td className="px-6 py-4 font-semibold">
    <button
      onClick={() => onPreview(complaint)}
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
    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg text-xs">
      {complaint.priority || "medium"}
    </span>
  </td>

  <td className="px-6 py-4">
    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs">
      {complaint.status}
    </span>
  </td>

  <td className="px-6 py-4 text-slate-400">
    {getCreatedAtDate()}
  </td>

  <td className="px-6 py-4 flex gap-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onStatusChange(complaint.id, "resolved");
      }}
      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs"
    >
      Resolve
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(complaint.id);
      }}
      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs"
    >
      Delete
    </button>
  </td>

</tr>
  );
}

export default ComplaintRow;
