import { NextResponse } from "next/server";

import { contactRecipientById } from "@/config";
import {
  checkContactRateLimit,
  checkFormTiming,
  FIELD_LIMITS,
  getClientIp,
  trimToMax,
  turnstileConfigured,
  verifyTurnstileToken,
} from "@/lib/contact-spam-guard.mjs";
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

/** Silent success for bots — do not reveal detection. */
function botOkResponse() {
  return NextResponse.json({ ok: true });
}

/** @param {unknown} body */
function parseInquiryBody(body) {
  if (!body || typeof body !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (body);

  if (
    String(record.website ?? "").trim() ||
    String(record.company ?? "").trim()
  ) {
    return { honeypot: true };
  }

  const timing = checkFormTiming(record.formStartedAt);
  if (!timing.ok) {
    return { bot: true };
  }

  const name = trimToMax(record.name, FIELD_LIMITS.name);
  const email = trimToMax(record.email, FIELD_LIMITS.email);
  const phone = trimToMax(record.phone, FIELD_LIMITS.phone);
  const preferredDate = trimToMax(
    record.preferredDate ?? record.weddingDate,
    FIELD_LIMITS.preferredDate,
  );
  const comments = trimToMax(record.comments, FIELD_LIMITS.comments);
  const recipient = trimToMax(record.recipient ?? "general", 32) || "general";
  const turnstileToken = String(record.turnstileToken ?? "").trim();

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
  if (!contactRecipientById[recipient]) {
    errors.recipient = "Choose who you would like to reach.";
  }
  if (turnstileConfigured() && !turnstileToken) {
    errors.turnstile = "Complete the verification check.";
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
      recipient,
    },
    turnstileToken,
  };
}

export async function POST(request) {
  const rateLimit = checkContactRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a few minutes and try again.",
      },
      {
        status: 429,
        headers: rateLimit.retryAfterSec
          ? { "Retry-After": String(rateLimit.retryAfterSec) }
          : undefined,
      },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 32_000) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

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
  if ("honeypot" in parsed || "bot" in parsed) {
    return botOkResponse();
  }
  if ("errors" in parsed) {
    return NextResponse.json({ errors: parsed.errors }, { status: 422 });
  }

  const clientIp = getClientIp(request);
  const turnstile = await verifyTurnstileToken(parsed.turnstileToken, clientIp);
  if (!turnstile.ok) {
    if (turnstile.skipped && process.env.NODE_ENV === "production") {
      console.warn(
        "[contact/inquiry] Turnstile is not configured in production. Set TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY.",
      );
    } else if (!turnstile.skipped) {
      console.warn("[contact/inquiry] Turnstile rejected:", turnstile.reason);
      return botOkResponse();
    }
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
