import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AddComplaintDialog from "../components/AddComplaintDialog";
import EditComplaintDialog from "../components/EditComplaintDialog";

type Complaint = {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: string;
  status: string;
  createdAt?: any;
  userId: string;
  userEmail?: string | null;
};

type ComplaintInput = {
  title: string;
  category: string;
  description: string;
  priority: string;
};

function UserDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(
    null,
  );
  const navigate = useNavigate();

  const fetchUserComplaints = async (uid: string) => {
    try {
      const q = query(collection(db, "complaints"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const list: Complaint[] = [];

      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Complaint, "id">) });
      });

      setComplaints(list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        fetchUserComplaints(user.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAddComplaint = async (complaint: ComplaintInput) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to submit a complaint.");
        navigate("/");
        return;
      }

      const payload = {
        ...complaint,
        userId: user.uid,
        userEmail: user.email,
        submittedBy: user.email,
        status: "open",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "complaints"), payload);

      fetchUserComplaints(user.uid);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditComplaint = async (updated: ComplaintInput & { id: string }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in.");
        navigate("/");
        return;
      }

      const complaint = complaints.find((c) => c.id === updated.id);
      if (!complaint || complaint.userId !== user.uid) {
        alert("You can only edit complaints submitted by you.");
        return;
      }

      await updateDoc(doc(db, "complaints", updated.id), {
        title: updated.title,
        category: updated.category,
        description: updated.description,
        priority: updated.priority,
      });

      setEditingComplaint(null);
      fetchUserComplaints(user.uid);
    } catch (err) {
      console.log(err);
      alert("Error updating complaint");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "open") return "text-red-400";
    if (status === "in_progress") return "text-yellow-400";
    if (status === "resolved") return "text-green-400";
    if (status === "closed") return "text-cyan-400";
    return "text-gray-400";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-500/20 text-red-400";
    if (priority === "medium") return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">User Dashboard</h1>
            <p className="text-xs text-slate-400">Track & submit complaints</p>
          </div>

          <div className="flex gap-3">
            <AddComplaintDialog onAdd={handleAddComplaint} />

            <button
              onClick={() => {
                signOut(auth);
                navigate("/");
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <h2 className="text-2xl font-bold mb-2">Your Complaints</h2>
        <p className="text-slate-400 mb-6">
          Track all submitted issues & their current status
        </p>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">{c.title}</td>
                    <td className="px-6 py-4">{c.category}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(c.priority)}`}
                      >
                        {c.priority}
                      </span>
                    </td>

                    <td className={`px-6 py-4 font-semibold ${getStatusColor(c.status)}`}>
                      {c.status}
                    </td>

                    <td className="px-6 py-4">
                      {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingComplaint(c)}
                        className="bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded text-xs font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400 text-lg">
                      No complaints submitted yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <EditComplaintDialog
        complaint={editingComplaint}
        open={!!editingComplaint}
        onClose={() => setEditingComplaint(null)}
        onSave={handleEditComplaint}
      />
    </div>
  );
}

export default UserDashboard;
