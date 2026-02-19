import { useState } from "react";
import { createPortal } from "react-dom";

const TITLE_MAX_CHARS = 80;
const DESCRIPTION_MAX_WORDS = 200;

const getWordCount = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

function AddComplaintDialog({ onAdd }) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !category || !description) {
      alert("Please fill all fields");
      return;
    }
    if (getWordCount(description) > DESCRIPTION_MAX_WORDS) {
      alert(`Description must be ${DESCRIPTION_MAX_WORDS} words or less.`);
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
        className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-semibold text-white"
      >
        + Add Complaint
      </button>

      {open && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="bg-[#020617] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto text-white">
            
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
              Submit Complaint
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Added text-white to inputs so text is visible on black bg */}
              <input
                type="text"
                placeholder="Complaint title"
                className="w-full p-3 rounded bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                value={title}
                maxLength={TITLE_MAX_CHARS}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-xs text-slate-400 text-right">
                {title.length}/{TITLE_MAX_CHARS} characters
              </p>

              <input
                type="text"
                placeholder="Category (Hostel, Bus, Food...)"
                className="w-full p-3 rounded bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <textarea
                placeholder="Describe your issue..."
                className="w-full p-3 rounded bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                rows={4}
                value={description}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (getWordCount(nextValue) <= DESCRIPTION_MAX_WORDS) {
                    setDescription(nextValue);
                  }
                }}
              />
              <p className="text-xs text-slate-400 text-right">
                {getWordCount(description)}/{DESCRIPTION_MAX_WORDS} words
              </p>

              <select
                className="w-full p-3 rounded bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-500 transition-colors"
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
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 font-semibold text-white transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default AddComplaintDialog;
