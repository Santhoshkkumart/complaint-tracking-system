type ComplaintMailPayload = {
  event: "complaint_created" | "complaint_status_updated" | "complaint_deleted";
  complaintId: string;
  title?: string;
  category?: string;
  priority?: string;
  status?: string;
  submittedBy?: string;
  userEmail?: string;
};

export async function sendComplaintMail(payload: ComplaintMailPayload) {
  try {
    await fetch("/api/mailer/complaint-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Mailer request failed:", error);
  }
}
