import nodemailer from "nodemailer";

function smtpPassword() {
  return (
    process.env.SMTP_PASS?.trim() || process.env.SMTP_PASSWORD?.trim() || ""
  );
}

/** Nodemailer "from" string: "Name <email>" or plain email */
export function smtpFromAddress() {
  const single = process.env.SMTP_FROM?.trim();
  if (single) return single;
  const email = process.env.SMTP_FROM_EMAIL?.trim();
  if (!email) return "";
  const name = process.env.SMTP_FROM_NAME?.trim();
  if (!name) return email;
  const safe = name.replace(/[\r\n<>]/g, "");
  return `${safe} <${email}>`;
}

export function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      smtpPassword() &&
      smtpFromAddress(),
  );
}

export function smtpMissingParts() {
  const missing = [];
  if (!process.env.SMTP_HOST?.trim()) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER?.trim()) missing.push("SMTP_USER");
  if (!smtpPassword()) missing.push("SMTP_PASS or SMTP_PASSWORD");
  if (!smtpFromAddress()) {
    missing.push("SMTP_FROM or SMTP_FROM_EMAIL (+ optional SMTP_FROM_NAME)");
  }
  return missing;
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || "587") || 587;
  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1";
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: smtpPassword(),
    },
  });
}

/**
 * @param {{
 *   to: string;
 *   subject: string;
 *   text: string;
 *   html: string;
 *   replyTo?: string;
 *   cc?: string[];
 *   bcc?: string[];
 * }} opts
 */
export async function sendSmtpMessage(opts) {
  if (!smtpConfigured()) {
    throw new Error(
      `SMTP is not configured (missing: ${smtpMissingParts().join(", ")})`,
    );
  }

  const transport = createTransport();
  await transport.sendMail({
    from: smtpFromAddress(),
    to: opts.to,
    replyTo: opts.replyTo,
    cc: opts.cc,
    bcc: opts.bcc,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}

export function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
