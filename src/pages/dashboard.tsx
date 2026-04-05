import { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { Complaint, useComplaints } from "../hooks/useComplaints";
import AddComplaintDialog from "../components/AddComplaintDialog";
import ComplaintDetail from "../components/ComplaintDetail";
import ComplaintAnalysisCard from "../components/ComplaintAnalysisCard";
import AdminNotificationBox from "../components/AdminNotificationBox";
import { BeamsBackground } from "../components/ui/beams-background";
import { Button04 } from "../components/ui/animated-arrow-button";
import ComplaintContributorsTable from "@/components/ui/ruixen-contributors-table";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { complaints, loading, addComplaint, updateComplaintStatus, deleteComplaint } =
    useComplaints(user?.uid, true);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState<Complaint[]>([]);
  const previewTimeoutRef = useRef<number | null>(null);
  const hydratedComplaintIdsRef = useRef<Set<string> | null>(null);

  const filterOptions = [
    { value: "all", label: "All", icon: <FileText size={16} />, count: complaints.length },
    {
      value: "open",
      label: "Open",
      icon: <AlertCircle size={16} />,
      count: complaints.filter((complaint) => complaint.status === "open").length,
    },
    {
      value: "in_progress",
      label: "Progress",
      icon: <Clock size={16} />,
      count: complaints.filter((complaint) => complaint.status === "in_progress").length,
    },
    {
      value: "resolved",
      label: "Resolved",
      icon: <CheckCircle size={16} />,
      count: complaints.filter((complaint) => complaint.status === "resolved").length,
    },
    {
      value: "closed",
      label: "Closed",
      icon: <CheckCircle size={16} />,
      count: complaints.filter((complaint) => complaint.status === "closed").length,
    },
  ];

  useEffect(() => {
    if (loading) {
      return;
    }

    const currentIds = new Set(complaints.map((complaint) => complaint.id));

    if (hydratedComplaintIdsRef.current === null) {
      hydratedComplaintIdsRef.current = currentIds;
      return;
    }

    const newlyArrivedComplaints = complaints.filter(
      (complaint) => !hydratedComplaintIdsRef.current?.has(complaint.id),
    );

    if (newlyArrivedComplaints.length > 0) {
      setNotifications((current) => {
        const seenIds = new Set(current.map((item) => item.id));
        const merged = [
          ...newlyArrivedComplaints.filter((item) => !seenIds.has(item.id)),
          ...current,
        ];

        return merged.slice(0, 5);
      });
    }

    hydratedComplaintIdsRef.current = currentIds;
  }, [complaints, loading]);

  const handleAdd = async (complaintData: any) => {
    if (!user?.email) {
      return;
    }

    await addComplaint(complaintData, { uid: user.uid, email: user.email });
  };

  const handleStatusChange = async (id: string, status: Complaint["status"]) => {
    try {
      await updateComplaintStatus(id, status);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      await deleteComplaint(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreview = (complaint: Complaint, transient = false) => {
    setSelectedComplaint(complaint);
    setNotifications((current) => current.filter((item) => item.id !== complaint.id));

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

  const filteredComplaints = complaints.filter(
    (complaint) => statusFilter === "all" || complaint.status === statusFilter,
  );

  const analysisSummary = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((complaint) => complaint.status === "open").length;
    const inProgress = complaints.filter((complaint) => complaint.status === "in_progress").length;
    const resolved = complaints.filter((complaint) => complaint.status === "resolved").length;
    const closed = complaints.filter((complaint) => complaint.status === "closed").length;

    return { total, open, inProgress, resolved, closed };
  }, [complaints]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#020617] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <BeamsBackground
      intensity="medium"
      className="flex min-h-[100dvh] w-full max-w-full flex-col overflow-hidden text-white"
    >
      <>
        <header className="z-50 shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div>
              <h1 className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                Complaint Command Center
              </h1>
              <p className="mt-1 text-xs text-slate-400">Smart complaint intelligence dashboard</p>
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-4">
              <div className="order-2 text-right sm:order-1">
                <button
                  onClick={() => {
                    signOut(auth);
                    navigate("/");
                  }}
                  className="inline-flex min-h-10 items-center justify-center rounded border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
              <div className="order-1 sm:order-2">
                <AddComplaintDialog onAdd={handleAdd} />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
          <div className="space-y-6 pb-8">
            <div className="grid shrink-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg transition hover:scale-105 sm:p-4">
                <p className="text-[10px] text-slate-400 sm:text-xs">Open Complaints</p>
                <h2 className="mt-1 text-xl font-bold text-red-400 sm:text-2xl">
                  {analysisSummary.open}
                </h2>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg transition hover:scale-105 sm:p-4">
                <p className="text-[10px] text-slate-400 sm:text-xs">In Progress</p>
                <h2 className="mt-1 text-xl font-bold text-yellow-400 sm:text-2xl">
                  {analysisSummary.inProgress}
                </h2>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg transition hover:scale-105 sm:p-4">
                <p className="text-[10px] text-slate-400 sm:text-xs">Resolved</p>
                <h2 className="mt-1 text-xl font-bold text-green-400 sm:text-2xl">
                  {analysisSummary.resolved}
                </h2>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg transition hover:scale-105 sm:p-4">
                <p className="text-[10px] text-slate-400 sm:text-xs">Closed</p>
                <h2 className="mt-1 text-xl font-bold text-purple-400 sm:text-2xl">
                  {analysisSummary.closed}
                </h2>
              </div>
            </div>

            <ComplaintAnalysisCard complaints={complaints} />

            <AdminNotificationBox
              notifications={notifications}
              onView={(complaint) => handlePreview(complaint, false)}
              onDismiss={(id) => setNotifications((current) => current.filter((item) => item.id !== id))}
              onClearAll={() => setNotifications([])}
            />

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {filterOptions.map((option) => (
                <Button04
                  key={option.value}
                  isActive={statusFilter === option.value}
                  onClick={() => setStatusFilter(option.value)}
                  text={`${option.label} (${option.count})`}
                />
              ))}
            </div>

            <ComplaintContributorsTable
              complaints={filteredComplaints}
              mode="admin"
              onView={(complaint) => handlePreview(complaint, false)}
              onResolve={(id) => handleStatusChange(id, "resolved")}
              onDelete={handleDelete}
            />
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
