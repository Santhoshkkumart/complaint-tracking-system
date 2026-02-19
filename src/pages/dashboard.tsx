import { useEffect, useRef, useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

import { motion } from "framer-motion";
import { Search, AlertCircle, Clock, CheckCircle2, Archive, BarChart3 } from "lucide-react";

import AddComplaintDialog from "../components/AddComplaintDialog";
import ComplaintRow from "../components/ComplaintRow";
import ComplaintDetail from "../components/ComplaintDetail";
import StatCard from "../components/StatCard";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const previewTimeoutRef = useRef<number | null>(null);

  const fetchComplaints = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setComplaints(list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleAdd = async (complaint) => {
    try {
      const payload = {
        ...complaint,
        status: "open",
        createdAt: serverTimestamp(),
        submittedBy: "admin",
      };
      await addDoc(collection(db, "complaints"), payload);
      fetchComplaints();
    } catch (err) {
      console.log(err);
      alert("Error adding complaint");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const ref = doc(db, "complaints", id);
      await updateDoc(ref, { status });
      fetchComplaints();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "complaints", id));
      fetchComplaints();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePreview = (complaint, transient = false) => {
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
      c.submittedBy?.toLowerCase().includes(search.toLowerCase()) ||
      c.userEmail?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    open: complaints.filter((c) => c.status === "open").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    closed: complaints.filter((c) => c.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">

  <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-3 shadow-lg">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Complaint Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Smart complaint intelligence dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
        <div className="text-right">
          <p className="text-sm text-slate-300">Admin Panel</p>
          <p className="text-xs text-slate-500">System Active 🟢</p>
        </div>

        <AddComplaintDialog onAdd={handleAdd} />
      </div>

    </div>
  </header>


  <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition shadow-lg">
        <p className="text-slate-400 text-sm">Open Complaints</p>
        <h2 className="text-3xl font-bold text-red-400 mt-2">{stats.open}</h2>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition shadow-lg">
        <p className="text-slate-400 text-sm">In Progress</p>
        <h2 className="text-3xl font-bold text-yellow-400 mt-2">{stats.inProgress}</h2>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition shadow-lg">
        <p className="text-slate-400 text-sm">Resolved</p>
        <h2 className="text-3xl font-bold text-green-400 mt-2">{stats.resolved}</h2>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition shadow-lg">
        <p className="text-slate-400 text-sm">Closed</p>
        <h2 className="text-3xl font-bold text-cyan-400 mt-2">{stats.closed}</h2>
      </div>

    </div>


    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-white/5 border border-white/10 backdrop-blur-xl">
          <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

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


    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-sm">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Complaint</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((complaint) => (
              <ComplaintRow
                key={complaint.id}
                complaint={complaint}
                onStatusChange={handleStatusChange}
                onPreview={handlePreview}
                onDelete={handleDelete}
              />
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  🚀 No complaints yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  </main>


  <ComplaintDetail
    complaint={selectedComplaint}
    open={!!selectedComplaint}
    onClose={() => setSelectedComplaint(null)}
    onStatusChange={handleStatusChange}
  />

</div>
  );
}

export default Dashboard;
