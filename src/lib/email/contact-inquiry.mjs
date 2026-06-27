import {
  contactRecipientForId,
  orgName,
} from "../../config/config.js";
import { escapeHtml, sendSmtpMessage, smtpConfigured, smtpMissingParts } from "./smtp.mjs";

/** Env override: CONTACT_RECIPIENT_<ID>=email (e.g. CONTACT_RECIPIENT_TYLER) */
function recipientInbox(recipientId) {
  const entry = contactRecipientForId(recipientId);
  const envKey = `CONTACT_RECIPIENT_${String(entry.id).toUpperCase()}`;
  return process.env[envKey]?.trim() || entry.email;
}

function formatPreferredDate(isoDate) {
  const raw = String(isoDate ?? "").trim();
  if (!raw) return "Not provided";
  const [y, m, d] = raw.split("-").map(Number);
  if (!y || !m || !d) return raw;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * @param {{
 *   name: string;
 *   email: string;
 *   phone?: string;
 *   preferredDate?: string;
 *   weddingDate?: string;
 *   comments?: string;
 *   recipient?: string;
 * }} inquiry
 */
export async function sendContactInquiryEmail(inquiry) {
  const recipient = contactRecipientForId(inquiry.recipient);
  const to = recipientInbox(recipient.id);
  if (!to) {
    throw new Error("Contact recipient email is not configured");
  }
  if (!smtpConfigured()) {
    throw new Error(
      `SMTP is not configured (missing: ${smtpMissingParts().join(", ")})`,
    );
  }

  const name = String(inquiry.name ?? "").trim();
  const email = String(inquiry.email ?? "").trim();
  const phone = String(inquiry.phone ?? "").trim();
  const preferredDate = formatPreferredDate(
    inquiry.preferredDate ?? inquiry.weddingDate,
  );
  const comments = String(inquiry.comments ?? "").trim();
  const recipientLabel = recipient.label;

  const subject =
    recipient.id === "general"
      ? `Estimate request — ${name}`
      : `Estimate request — ${name} (for ${recipientLabel})`;

  const text = [
    `New contact form submission for ${orgName}`,
    "",
    `Sent to: ${recipientLabel} (${to})`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Preferred start date: ${preferredDate}`,
    "",
    "Comments:",
    comments || "(none)",
  ].join("\n");

  const html = `<div style="font-family:Georgia,serif;line-height:1.6;color:#1c1917">
      <p style="margin:0 0 1rem;font-size:1.125rem">New contact form submission for ${escapeHtml(orgName)}</p>
      <p style="margin:0 0 1rem;font-size:0.9375rem;color:#57534e">Sent to: <strong>${escapeHtml(recipientLabel)}</strong> (${escapeHtml(to)})</p>
      <table style="border-collapse:collapse;font-size:0.9375rem">
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Phone</td><td>${escapeHtml(phone || "Not provided")}</td></tr>
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Preferred start date</td><td>${escapeHtml(preferredDate)}</td></tr>
      </table>
      <p style="margin:1.25rem 0 0.35rem;font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:#78716c">Comments</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(comments || "(none)")}</p>
    </div>`;

  await sendSmtpMessage({
    to,
    replyTo: email,
    subject,
    text,
    html,
  });
}
