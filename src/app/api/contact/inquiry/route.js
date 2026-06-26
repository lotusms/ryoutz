import { NextResponse } from "next/server";

import { sendContactInquiryEmail } from "@/lib/email/contact-inquiry.mjs";
import { digitsFromTelInput } from "@/lib/phone-format";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidEmail(value) {
  return EMAIL_RE.test(String(value ?? "").trim());
}

function isValidIsoDate(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return true;
  if (!ISO_DATE_RE.test(raw)) return false;
  const [y, m, d] = raw.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/** @param {unknown} body */
function parseInquiryBody(body) {
  if (!body || typeof body !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (body);

  if (String(record.website ?? "").trim()) {
    return { honeypot: true };
  }

  const name = String(record.name ?? "").trim();
  const email = String(record.email ?? "").trim();
  const phone = String(record.phone ?? "").trim();
  const preferredDate = String(
    record.preferredDate ?? record.weddingDate ?? "",
  ).trim();
  const comments = String(record.comments ?? "").trim();

  const errors = {};
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  const phoneDigits = digitsFromTelInput(phone);
  if (phone && phoneDigits.length > 0 && phoneDigits.length < 10) {
    errors.phone = "Enter all 10 digits, or leave phone blank.";
  }
  if (!isValidIsoDate(preferredDate)) {
    errors.preferredDate = "Choose a valid preferred start date.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    inquiry: {
      name,
      email,
      phone: phoneDigits ? phone : "",
      preferredDate,
      comments,
    },
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseInquiryBody(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if ("honeypot" in parsed) {
    return NextResponse.json({ ok: true });
  }
  if ("errors" in parsed) {
    return NextResponse.json({ errors: parsed.errors }, { status: 422 });
  }

  try {
    await sendContactInquiryEmail(parsed.inquiry);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact/inquiry]", err);
    const message =
      err instanceof Error ? err.message : "Could not send your message.";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Could not send your message. Please try again or email us directly.",
      },
      { status: 500 },
    );
  }
}
