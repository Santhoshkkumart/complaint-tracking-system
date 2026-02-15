function ComplaintRow({ complaint, onStatusChange, onSelect, onDelete }) {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition">

  <td className="px-6 py-4 font-mono text-sm text-slate-400">
    {complaint.id?.slice(0,6)}
  </td>

  <td className="px-6 py-4 font-semibold">
    {complaint.title}
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
    {complaint.createdAt
      ? new Date(complaint.createdAt).toLocaleDateString()
      : "—"}
  </td>

  <td className="px-6 py-4 flex gap-2">
    <button
      onClick={() => onStatusChange(complaint.id, "resolved")}
      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs"
    >
      Resolve
    </button>

    <button
      onClick={() => onDelete(complaint.id)}
      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs"
    >
      Delete
    </button>
  </td>

</tr>
  );
}

export default ComplaintRow;
