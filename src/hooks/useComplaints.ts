import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { sendComplaintConfirmation } from "../services/mailer";

export interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: any;
  userId: string;
  userEmail: string;
  mobile?: string;
}

export type ComplaintInput = Omit<Complaint, "id" | "status" | "createdAt" | "userId" | "userEmail">;

export const useComplaints = (userId?: string | null, fetchAll = false) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fetchAll && !userId) {
      setComplaints([]);
      setLoading(false);
      setError(null);
      return;
    }

    let q;
    if (fetchAll) {
      q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "complaints"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Complaint[];
        setComplaints(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching complaints:", err);
        setError("Failed to fetch complaints");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, fetchAll]);

  const addComplaint = async (input: ComplaintInput, user: { uid: string; email: string }) => {
    try {
      const payload = {
        ...input,
        userId: user.uid,
        userEmail: user.email,
        status: "open",
        createdAt: serverTimestamp(),
      };
      const complaintRef = await addDoc(collection(db, "complaints"), payload);

      try {
        await sendComplaintConfirmation({
          to_email: user.email,
          complaint_id: complaintRef.id,
          title: input.title,
          category: input.category,
          description: input.description,
          priority: input.priority,
          mobile: input.mobile || "",
          submitted_at: new Date().toLocaleString(),
        });
      } catch (mailError) {
        console.error("Complaint saved, but confirmation email failed:", mailError);
      }
    } catch (err) {
      console.error("Error adding complaint:", err);
      throw err;
    }
  };

  const updateComplaintStatus = async (id: string, status: Complaint["status"]) => {
    try {
      const ref = doc(db, "complaints", id);
      await updateDoc(ref, { status });
    } catch (err) {
      console.error("Error updating complaint status:", err);
      throw err;
    }
  };

  const updateComplaint = async (id: string, data: Partial<ComplaintInput>) => {
    try {
      const ref = doc(db, "complaints", id);
      await updateDoc(ref, data);
    } catch (err) {
      console.error("Error updating complaint:", err);
      throw err;
    }
  };

  const deleteComplaint = async (id: string) => {
    try {
      await deleteDoc(doc(db, "complaints", id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
      throw err;
    }
  };

  return {
    complaints,
    loading,
    error,
    addComplaint,
    updateComplaintStatus,
    updateComplaint,
    deleteComplaint,
  };
};
