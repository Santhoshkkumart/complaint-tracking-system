import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useComplaints } from "../hooks/useComplaints";
import { BeamsBackground } from "../components/ui/beams-background";
import ComplaintContributorsTable from "@/components/ui/ruixen-contributors-table";

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { complaints, loading } = useComplaints(user?.uid);

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
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
            <div>
              <h1 className="text-xl font-bold text-purple-400">User Dashboard</h1>
              <p className="mt-1 text-xs text-slate-400">Track and submit complaints</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
              <button
                type="button"
                onClick={() => navigate("/complaints/new")}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-600 hover:to-indigo-700 active:scale-95"
              >
                Add a Complaint
              </button>

              <button
                onClick={() => {
                  signOut(auth);
                  navigate("/");
                }}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="w-full flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-1 text-xl font-bold">Your Complaints</h2>
            <p className="mb-4 text-xs text-slate-400">
              Track all submitted issues and their current status
            </p>

            <div className="w-full pb-8">
              <ComplaintContributorsTable
                complaints={complaints}
                mode="user"
                onEdit={(complaint) => navigate(`/complaints/${complaint.id}/edit`, { state: { complaint } })}
              />
            </div>
          </div>
        </main>
      </>
    </BeamsBackground>
  );
}

export default UserDashboard;
