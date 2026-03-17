import emailjs from "@emailjs/browser";
import { getRequiredEnvValue, warnMissingEnv } from "./env";

interface ComplaintConfirmationParams {
  to_email: string;
  complaint_id: string;
  title: string;
  category: string;
  description: string;
  priority: string;
  mobile: string;
  submitted_at: string;
}

const DEFAULT_REPLY_TO = "santhoshkkumarsan@gmail.com";

export const sendComplaintConfirmation = async (
  params: ComplaintConfirmationParams
) => {
  if (
    warnMissingEnv("emailjs", [
      "VITE_EMAILJS_SERVICE_ID",
      "VITE_EMAILJS_TEMPLATE_ID",
      "VITE_EMAILJS_PUBLIC_KEY",
    ])
  ) {
    return;
  }

  const serviceId = getRequiredEnvValue("VITE_EMAILJS_SERVICE_ID");
  const templateId = getRequiredEnvValue("VITE_EMAILJS_TEMPLATE_ID");
  const publicKey = getRequiredEnvValue("VITE_EMAILJS_PUBLIC_KEY");
  const replyTo =
    getRequiredEnvValue("VITE_EMAILJS_REPLY_TO") || DEFAULT_REPLY_TO;

  await emailjs.send(
    serviceId,
    templateId,
    {
      ...params,
      priority: params.priority.toUpperCase(),
      // Keep replies pointed at the admin inbox instead of the complainant.
      reply_to: replyTo,
    },
    { publicKey }
  );
};
