import { useState } from "react";

function AddComplaintDialog({ onAdd }) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !category || !description) {
      alert("Please fill all fields");
      return;
    }

    onAdd({
      title,
      category,
      description,
      priority,
    });

    setTitle("");
    setCategory("");
    setDescription("");
    setPriority("low");

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-semibold"
      >
        + Add Complaint
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#020617] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
              Submit Complaint
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Complaint title"
                className="w-full p-3 rounded bg-black border border-white/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Category (Hostel, Bus, Food...)"
                className="w-full p-3 rounded bg-black border border-white/20"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <textarea
                placeholder="Describe your issue..."
                className="w-full p-3 rounded bg-black border border-white/20"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select
                className="w-full p-3 rounded bg-black border border-white/20"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 font-semibold"
                >
                  Submit
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddComplaintDialog;
