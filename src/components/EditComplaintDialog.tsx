import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ComplaintInput = {
  title: string;
  category: string;
  description: string;
  priority: string;
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

  useEffect(() => {
    if (!complaint) return;
    setTitle(complaint.title || "");
    setCategory(complaint.category || "");
    setDescription(complaint.description || "");
    setPriority(complaint.priority || "low");
  }, [complaint]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!complaint) return;

    if (!title || !category || !description) {
      alert("Please fill all fields");
      return;
    }

    await onSave({
      id: complaint.id,
      title,
      category,
      description,
      priority,
    });
  };

  if (!open || !complaint) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
      <div className="bg-[#020617] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto text-white">
        <h2 className="text-xl font-bold mb-4 text-cyan-400">Edit Complaint</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            className="w-full p-3 rounded bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <textarea
            className="w-full p-3 rounded bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full p-3 rounded bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 font-semibold text-white transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default EditComplaintDialog;
