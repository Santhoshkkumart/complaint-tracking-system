import { useRef, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useComplaints } from "../hooks/useComplaints";

import { BentoGrid, BentoCard } from "../components/ui/bento-grid";
import { Search, BarChart3, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";

import AddComplaintDialog from "../components/AddComplaintDialog";
import ComplaintDetail from "../components/ComplaintDetail";
import { BeamsBackground } from "../components/ui/beams-background";
import { Button04 } from "../components/ui/animated-arrow-button";

import { Input } from "@/components/ui/input";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { complaints, loading, addComplaint, updateComplaintStatus, deleteComplaint } = useComplaints();
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const previewTimeoutRef = useRef<number | null>(null);

  const filterOptions = [
    { value: "all", label: "All", icon: <FileText size={16} />, count: complaints.length },
    { value: "open", label: "Open", icon: <AlertCircle size={16} />, count: complaints.filter(c => c.status === "open").length },
    { value: "in_progress", label: "Progress", icon: <Clock size={16} />, count: complaints.filter(c => c.status === "in_progress").length },
    { value: "resolved", label: "Resolved", icon: <CheckCircle size={16} />, count: complaints.filter(c => c.status === "resolved").length },
    { value: "closed", label: "Closed", icon: <CheckCircle size={16} />, count: complaints.filter(c => c.status === "closed").length },
  ];

  const handleAdd = async (complaintData: any) => {
    try {
      if (!user?.email) return;
      await addComplaint(complaintData, { uid: user.uid, email: user.email });
    } catch (err) {
      console.error(err);
      alert("Error adding complaint");
    }
  };

  const handleStatusChange = async (id: string, status: any) => {
    try {
      await updateComplaintStatus(id, status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await deleteComplaint(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePreview = (complaint: any, transient = false) => {
    setSelectedComplaint(complaint);

    if (!transient) {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
        previewTimeoutRef.current = null;
      }
      return;
    }

    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
    }

    previewTimeoutRef.current = window.setTimeout(() => {
      setSelectedComplaint(null);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const filtered = complaints.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    open: complaints.filter((c) => c.status === "open").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    closed: complaints.filter((c) => c.status === "closed").length,
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                Complaint Command Center
              </h1>
              <p className="text-[10px] text-slate-400">Smart complaint intelligence dashboard</p>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
              <div className="text-right">
                <button
                  onClick={() => {
                    signOut(auth);
                    navigate("/");
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 font-bold bg-red-500/10 px-2 py-1 rounded border border-red-500/20"
                >
                  Logout 🚪
                </button>
              </div>
              <AddComplaintDialog onAdd={handleAdd} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 hover:scale-105 transition shadow-lg">
              <p className="text-slate-400 text-[10px] sm:text-xs">Open Complaints</p>
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mt-1">{stats.open}</h2>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 hover:scale-105 transition shadow-lg">
              <p className="text-slate-400 text-[10px] sm:text-xs">In Progress</p>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mt-1">{stats.inProgress}</h2>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 hover:scale-105 transition shadow-lg">
              <p className="text-slate-400 text-[10px] sm:text-xs">Resolved</p>
              <h2 className="text-xl sm:text-2xl font-bold text-green-400 mt-1">{stats.resolved}</h2>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 hover:scale-105 transition shadow-lg">
              <p className="text-slate-400 text-[10px] sm:text-xs">Closed</p>
              <h2 className="text-xl sm:text-2xl font-bold text-purple-400 mt-1">{stats.closed}</h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((opt) => (
                <Button04
                  key={opt.value}
                  isActive={statusFilter === opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  text={`${opt.label} (${opt.count})`}
                />
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-400 backdrop-blur-xl"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="overflow-x-auto">
              <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.map((complaint) => {
                  let Icon = FileText;
                  let bgImage =
                    "https://images.unsplash.com/photo-1542435503-956c265008f5?auto=format&fit=crop&q=80&w=600";

                  if (complaint.status === "open") {
                    Icon = AlertCircle;
                    bgImage =
                      "https://images.unsplash.com/photo-1618397746666-63405ce5d015?auto=format&fit=crop&q=80&w=600";
                  } else if (complaint.status === "in_progress") {
                    Icon = Clock;
                    bgImage =
                      "https://images.unsplash.com/photo-1590396113978-01121cbaa110?auto=format&fit=crop&q=80&w=600";
                  } else if (complaint.status === "resolved") {
                    Icon = CheckCircle;
                    bgImage =
                      "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&q=80&w=600";
                  } else if (complaint.status === "closed") {
                    Icon = CheckCircle;
                  }

                  return (
                    <div key={complaint.id} className="col-span-1">
                      <BentoCard
                        name={complaint.title}
                        className="h-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50"
                        onClick={() => handlePreview(complaint, false)}
                        ariaLabel={`Open complaint ${complaint.title}`}
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
                        description={`${complaint.category} • ${complaint.priority.toUpperCase()} • ${complaint.status.replace("_", " ")}`}
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        {complaint.status !== "resolved" && complaint.status !== "closed" && (
                          <button
                            onClick={() => handleStatusChange(complaint.id, "resolved")}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors px-3 py-1 rounded text-xs font-semibold"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => handlePreview(complaint, false)}
                          className="bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors px-3 py-1 rounded text-xs font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors px-3 py-1 rounded text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="col-span-4 text-center py-12 text-slate-500 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    🚀 No complaints found
                  </div>
                )}
              </BentoGrid>
            </div>
          </div>
        </main>

        <ComplaintDetail
          complaint={selectedComplaint}
          open={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusChange={handleStatusChange}
        />
      </>
    </BeamsBackground>
  );
}

export default Dashboard;
