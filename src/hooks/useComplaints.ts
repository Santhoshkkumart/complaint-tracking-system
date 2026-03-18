import { useState, useEffect } from "react";
import { FirebaseError } from "firebase/app";
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

const getComplaintTime = (createdAt: Complaint["createdAt"]) => {
  if (!createdAt) return 0;
  if (typeof createdAt?.toMillis === "function") return createdAt.toMillis();

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const sortComplaintsByNewest = (items: Complaint[]) =>
  [...items].sort((a, b) => getComplaintTime(b.createdAt) - getComplaintTime(a.createdAt));

const formatFirestoreError = (err: unknown, fallbackMessage: string) => {
  if (err instanceof FirebaseError) {
    if (err.code === "permission-denied") {
      return "Firestore denied this request. Check your Firestore rules for complaint writes.";
    }

    if (err.code === "failed-precondition") {
      return "Firestore query needs configuration. Complaint data will load once the required index is removed or deployed.";
    }

    return `${fallbackMessage} (${err.code})`;
  }

  return fallbackMessage;
};

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
      q = query(collection(db, "complaints"), where("userId", "==", userId));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Complaint[];
        setComplaints(sortComplaintsByNewest(list));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching complaints:", err);
        setError(formatFirestoreError(err, "Failed to fetch complaints"));
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
      throw new Error(formatFirestoreError(err, "Failed to add complaint"));
    }
  };

  const updateComplaintStatus = async (id: string, status: Complaint["status"]) => {
    try {
      const ref = doc(db, "complaints", id);
      await updateDoc(ref, { status });
    } catch (err) {
      console.error("Error updating complaint status:", err);
      throw new Error(formatFirestoreError(err, "Failed to update complaint status"));
    }
  };

  const updateComplaint = async (id: string, data: Partial<ComplaintInput>) => {
    try {
      const ref = doc(db, "complaints", id);
      await updateDoc(ref, data);
    } catch (err) {
      console.error("Error updating complaint:", err);
      throw new Error(formatFirestoreError(err, "Failed to update complaint"));
    }
  };

  const deleteComplaint = async (id: string) => {
    try {
      await deleteDoc(doc(db, "complaints", id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
      throw new Error(formatFirestoreError(err, "Failed to delete complaint"));
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
