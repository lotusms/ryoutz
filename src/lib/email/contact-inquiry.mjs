import { orgInquiryEmail, orgName } from "../../config/config.js";
import { escapeHtml, sendSmtpMessage, smtpConfigured, smtpMissingParts } from "./smtp.mjs";

function inquiryInbox() {
  return (
    process.env.CONTACT_INQUIRY_EMAIL?.trim() ||
    orgInquiryEmail ||
    process.env.SMTP_USER?.trim() ||
    ""
  );
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
 * }} inquiry
 */
export async function sendContactInquiryEmail(inquiry) {
  const to = inquiryInbox();
  if (!to) {
    throw new Error("CONTACT_INQUIRY_EMAIL is not configured");
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

  const subject = `Estimate request — ${name}`;
  const text = [
    `New contact form submission for ${orgName}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Preferred start date: ${preferredDate}`,
    "",
    "Comments:",
    comments || "(none)",
  ].join("\n");

  const html = `<motion style="font-family:Georgia,serif;line-height:1.6;color:#1c1917">
      <p style="margin:0 0 1rem;font-size:1.125rem">New contact form submission for ${escapeHtml(orgName)}</p>
      <table style="border-collapse:collapse;font-size:0.9375rem">
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Phone</td><td>${escapeHtml(phone || "Not provided")}</td></tr>
        <tr><td style="padding:0.25rem 1rem 0.25rem 0;color:#57534e">Preferred start date</td><td>${escapeHtml(preferredDate)}</td></tr>
      </table>
      <p style="margin:1.25rem 0 0.35rem;font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:#78716c">Comments</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(comments || "(none)")}</p>
    </motion>`;

  await sendSmtpMessage({
    to,
    replyTo: email,
    subject,
    text,
    html: html.replaceAll("motion", "div"),
  });
}
