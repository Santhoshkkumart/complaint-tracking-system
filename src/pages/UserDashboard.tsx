import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useComplaints, ComplaintInput } from "../hooks/useComplaints";
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { BentoGrid, BentoCard } from "../components/ui/bento-grid";
import AddComplaintDialog from "../components/AddComplaintDialog";
import EditComplaintDialog from "../components/EditComplaintDialog";
import { BeamsBackground } from "../components/ui/beams-background";
import { useState } from "react";

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { complaints, loading, addComplaint, updateComplaint } = useComplaints(user?.uid);
  const [editingComplaint, setEditingComplaint] = useState<any>(null);

  const handleAddComplaint = async (complaintData: any) => {
    try {
      if (!user?.email) return;
      await addComplaint(complaintData, { uid: user.uid, email: user.email });
    } catch (err) {
      console.error(err);
      alert("Error adding complaint");
    }
  };

  const handleEditComplaint = async (updated: any) => {
    try {
      await updateComplaint(updated.id, {
        title: updated.title,
        category: updated.category,
        description: updated.description,
        priority: updated.priority,
        mobile: updated.mobile,
      });
      setEditingComplaint(null);
    } catch (err) {
      console.error(err);
      alert("Error updating complaint");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "open") return "text-red-400";
    if (status === "in_progress") return "text-yellow-400";
    if (status === "resolved") return "text-green-400";
    if (status === "closed") return "text-purple-400";
    return "text-gray-400";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-500/20 text-red-400";
    if (priority === "medium") return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <BeamsBackground intensity="medium" className="text-white h-screen w-screen overflow-hidden flex flex-col">
      <>
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl z-50 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-xl font-bold text-purple-400">User Dashboard</h1>
              <p className="text-[10px] text-slate-400">Track & submit complaints</p>
            </div>

            <div className="flex gap-3 items-center">
              <AddComplaintDialog onAdd={handleAddComplaint} />

              <button
                onClick={() => {
                  signOut(auth);
                  navigate("/");
                }}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-3 py-1 rounded-lg text-[10px] font-bold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-1">Your Complaints</h2>
            <p className="text-slate-400 mb-4 text-xs">
              Track all submitted issues & their current status
            </p>

            <div className="w-full pb-8">
              <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {complaints.map((c) => {
                let Icon = FileText;
                let bgImage =
                  "https://images.unsplash.com/photo-1542435503-956c265008f5?auto=format&fit=crop&q=80&w=600";

                if (c.status === "open") {
                  Icon = AlertCircle;
                  bgImage =
                    "https://images.unsplash.com/photo-1618397746666-63405ce5d015?auto=format&fit=crop&q=80&w=600";
                } else if (c.status === "in_progress") {
                  Icon = Clock;
                  bgImage =
                    "https://images.unsplash.com/photo-1590396113978-01121cbaa110?auto=format&fit=crop&q=80&w=600";
                } else if (c.status === "resolved") {
                  Icon = CheckCircle;
                  bgImage =
                    "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&q=80&w=600";
                } else if (c.status === "closed") {
                  Icon = CheckCircle;
                }

                return (
                  <div key={c.id} className="col-span-1">
                    <BentoCard
                      name={c.title}
                      className="h-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50"
                      background={
                        <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
                          <img
                            src={bgImage}
                            className="object-cover w-full h-full"
                            alt="background"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                      }
                      Icon={Icon}
                      description={`${c.category} • ${c.priority.toUpperCase()} • ${c.status.replace("_", " ")}`}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => setEditingComplaint(c)}
                        className="bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors px-3 py-1 rounded text-xs font-semibold"
                      >
                        Edit Complaint
                      </button>
                    </div>
                  </div>
                );
              })}

              {complaints.length === 0 && (
                <div className="col-span-3 text-center py-16 text-slate-400 text-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  No complaints submitted yet
                </div>
              )}
            </BentoGrid>
          </div>
        </div>
      </main>

        <EditComplaintDialog
          complaint={editingComplaint}
          open={!!editingComplaint}
          onClose={() => setEditingComplaint(null)}
          onSave={handleEditComplaint}
        />
      </>
    </BeamsBackground>
  );
}

export default UserDashboard;
