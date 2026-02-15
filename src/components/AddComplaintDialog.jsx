
import { useState } from "react";

function AddComplaintDialog({ onAdd }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [submittedBy, setSubmittedBy] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const newComplaint = {
            title,
            description,
            submittedBy,
            status: "open",
            priority: "medium",
            category: "service",
            createdAt: Date.now()
        };


        onAdd(newComplaint);
        setTitle("");
        setDescription("");
        setSubmittedBy("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                placeholder="Name"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <button className="bg-blue-600 text-white px-4 rounded">
                Add
            </button>
        </form>
    );
}

export default AddComplaintDialog;
