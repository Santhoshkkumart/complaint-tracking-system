import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
const PORT = Number(process.env.MAILER_PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/mailer/complaint-event", async (req, res) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  if (!apiKey || !from || !to) {
    return res.status(500).json({
      error:
        "Missing required env vars: RESEND_API_KEY, MAIL_FROM, MAIL_TO",
    });
  }

  const {
    event,
    complaintId,
    title,
    category,
    priority,
    status,
    submittedBy,
    userEmail,
  } =
    req.body ?? {};

  if (!event || !complaintId) {
    return res.status(400).json({ error: "event and complaintId are required" });
  }

  try {
    const resend = new Resend(apiKey);
    const safeTitle = String(title || "Untitled Complaint");
    const safeCategory = String(category || "general");
    const safePriority = String(priority || "medium");
    const safeStatus = String(status || "open");
    const safeSubmittedBy = String(submittedBy || "unknown");

    const subject = `ResolveX Alert: ${event} (${complaintId.slice(0, 8)})`;
    const html = `
      <h2>ResolveX Complaint Notification</h2>
      <p><strong>Event:</strong> ${event}</p>
      <p><strong>Complaint ID:</strong> ${complaintId}</p>
      <p><strong>Title:</strong> ${safeTitle}</p>
      <p><strong>Category:</strong> ${safeCategory}</p>
      <p><strong>Priority:</strong> ${safePriority}</p>
      <p><strong>Status:</strong> ${safeStatus}</p>
      <p><strong>Submitted By:</strong> ${safeSubmittedBy}</p>
    `;

    const adminResult = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    let userResult = null;
    if (event === "complaint_created" && userEmail) {
      userResult = await resend.emails.send({
        from,
        to: [String(userEmail)],
        subject: "Complaint submitted successfully",
        html: `
          <h2>Complaint Submitted Successfully</h2>
          <p>Your complaint has been recorded.</p>
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>Title:</strong> ${safeTitle}</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <p><strong>Priority:</strong> ${safePriority}</p>
          <p><strong>Status:</strong> ${safeStatus}</p>
          <p>Our team will review and update you soon.</p>
        `,
      });
    }

    res.json({
      ok: true,
      adminMailId: adminResult.data?.id ?? null,
      userMailId: userResult?.data?.id ?? null,
    });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Failed to send mail" });
  }
});

app.listen(PORT, () => {
  console.log(`Mailer server running on http://localhost:${PORT}`);
});
