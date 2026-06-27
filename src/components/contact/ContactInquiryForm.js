"use client";

import { useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import ContactHelpfulDetailsCard from "@/components/contact/ContactHelpfulDetailsCard";
import ContactTurnstile from "@/components/contact/ContactTurnstile";
import DateField from "@/components/ui/DateField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  contactRecipientForId,
  contactRecipients,
  orgInquiryEmail,
  orgPhoneLabel,
} from "@/config";
import { digitsFromTelInput, formatUsPhoneMask } from "@/lib/phone-format";
import * as overlayChrome from "@/lib/overlayChrome";

const DEFAULT_RECIPIENT = "general";
const TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

const EMPTY_FORM = {
  recipient: DEFAULT_RECIPIENT,
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  comments: "",
  website: "",
  company: "",
};

function isValidEmail(value) {
  const v = String(value ?? "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
}

function clientFieldErrors(form, turnstileToken) {
  const errors = {};
  if (!contactRecipientForId(form.recipient)) {
    errors.recipient = "Choose who you would like to reach.";
  }
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(form.email)) errors.email = "Enter a valid email address.";
  const phoneDigits = digitsFromTelInput(form.phone);
  if (form.phone.trim() && phoneDigits.length > 0 && phoneDigits.length < 10) {
    errors.phone = "Enter all 10 digits, or leave phone blank.";
  }
  if (TURNSTILE_ENABLED && !turnstileToken) {
    errors.turnstile = "Verification is still loading. Wait a moment, then try again.";
  }
  return errors;
}

function todayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ContactInquiryForm({ lines = [] }) {
  const labelClass = overlayChrome.checkoutLabelUppercase(false);
  const inputClass = overlayChrome.checkoutInputBase(false);
  const errorClass = overlayChrome.checkoutInlineError(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formStartedAt] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const minPreferredDate = useMemo(() => todayIsoDate(), []);
  const selectedRecipient = contactRecipientForId(form.recipient);

  const errors = clientFieldErrors(form, turnstileToken);
  const showError = (field) => Boolean(touched[field] && errors[field]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") setStatus("idle");
    if (serverError) setServerError("");
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handlePhoneChange(e) {
    const digits = digitsFromTelInput(e.target.value);
    update("phone", formatUsPhoneMask(digits));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      recipient: true,
      name: true,
      email: true,
      phone: true,
      preferredDate: true,
      comments: true,
      ...(TURNSTILE_ENABLED ? { turnstile: true } : {}),
    });

    const nextErrors = clientFieldErrors(form, turnstileToken);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/contact/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          formStartedAt,
          turnstileToken,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data?.errors && typeof data.errors === "object") {
          setTouched((prev) => ({
            ...prev,
            ...Object.fromEntries(Object.keys(data.errors).map((k) => [k, true])),
          }));
        }
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Could not send your message.",
        );
      }

      setStatus("success");
      setForm(EMPTY_FORM);
      setTurnstileToken("");
      setTouched({});
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Could not send your message.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const successCopy = "text-emerald-300/95";

  return (
    <Card variant="inset" className="min-w-0 w-full" title="Request an estimate" titleTag="h2">
      <p className="mt-2 text-sm leading-7 text-neutral-200/90">
        Choose who to reach, share your property details, and we will reply at the email you
        provide — usually within 48 hours.
      </p>

      {status === "success" ? (
        <p className={`mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm ${successCopy}`} role="status">
          Thank you — your request is on its way. We will be in touch soon.
        </p>
      ) : null}

      {lines.length > 0 ? (
        <div className="mt-6 border-t border-white/10 pt-6">
          <ContactHelpfulDetailsCard lines={lines} embedded />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <fieldset>
          <legend className={`${labelClass} mb-3 block`}>Who should receive this?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {contactRecipients.map((entry) => {
              const selected = form.recipient === entry.id;
              return (
                <label
                  key={entry.id}
                  className={[
                    "flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3.5 transition",
                    selected
                      ? "border-blue-400/50 bg-blue-500/10 ring-1 ring-blue-400/30"
                      : "border-white/10 bg-white/[0.03] hover:border-amber-500/30 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <span className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="recipient"
                      value={entry.id}
                      checked={selected}
                      onChange={() => update("recipient", entry.id)}
                      onBlur={() => markTouched("recipient")}
                      className="mt-1 size-4 shrink-0 accent-[#0071f0]"
                    />
                    <span className="min-w-0">
                      <span className="block font-serif text-base font-medium text-site-fg">
                        {entry.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-neutral-200/80">
                        {entry.description}
                      </span>
                      <span className="mt-1 block truncate text-[0.7rem] tracking-wide text-blue-300/80">
                        {entry.email}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {showError("recipient") ? (
            <p className={`${errorClass} mt-2`} role="alert">
              {errors.recipient}
            </p>
          ) : null}
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="contact-name" className={labelClass}>
              Name
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                onBlur={() => markTouched("name")}
                className={inputClass}
                aria-invalid={showError("name")}
              />
            </label>
            {showError("name") ? (
              <p className={errorClass} role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="contact-email" className={labelClass}>
              Email
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => markTouched("email")}
                className={inputClass}
                aria-invalid={showError("email")}
              />
            </label>
            {showError("email") ? (
              <p className={errorClass} role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                maxLength={24}
                value={form.phone}
                onChange={handlePhoneChange}
                onBlur={() => markTouched("phone")}
                className={inputClass}
                placeholder={orgPhoneLabel}
                aria-invalid={showError("phone")}
              />
            </label>
            {showError("phone") ? (
              <p className={errorClass} role="alert">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <DateField
            id="contact-preferred-date"
            label="Preferred start date"
            name="preferredDate"
            value={form.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
            min={minPreferredDate}
            labelClassName={labelClass}
            inputClassName={inputClass}
            colorScheme="dark"
          />
        </div>

        <div>
          <label htmlFor="contact-comments" className={labelClass}>
            Comments
            <textarea
              id="contact-comments"
              name="comments"
              rows={4}
              maxLength={4000}
              value={form.comments}
              onChange={(e) => update("comments", e.target.value)}
              className={`${inputClass} resize-y min-h-[6.5rem]`}
              placeholder="Property address, surface type, problem areas, or anything else that would help us quote the job."
            />
          </label>
        </div>

        {serverError ? (
          <p className={errorClass} role="alert">
            {serverError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <PrimaryButton type="submit" disabled={submitting} className="px-6 py-2.5">
            {submitting
              ? "Sending…"
              : `Send to ${selectedRecipient.label}`}
          </PrimaryButton>
          <p className="text-xs text-neutral-200/90">
            Or email{" "}
            <a
              href={`mailto:${orgInquiryEmail}`}
              className="underline decoration-amber-500/40 underline-offset-2 transition hover:text-blue-300/90"
            >
              {orgInquiryEmail}
            </a>{" "}
            directly.
          </p>
        </div>

        {TURNSTILE_ENABLED ? (
          <div className="pt-2">
            <div className="flex justify-end">
              <ContactTurnstile
                onToken={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>
            {showError("turnstile") ? (
              <p className={`${errorClass} mt-2 text-right`} role="alert">
                {errors.turnstile}
              </p>
            ) : null}
          </div>
        ) : null}
      </form>

      <p className="mt-8 border-t border-site-fg/10 px-4 pt-6 text-center text-xs uppercase tracking-[0.22em] text-neutral-200/90 sm:px-12">
        Spring and fall book quickly — reach out early for your preferred window.
      </p>
    </Card>
  );
}
