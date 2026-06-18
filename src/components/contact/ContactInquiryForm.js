"use client";

import { useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import DateField from "@/components/ui/DateField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { orgInquiryEmail } from "@/config";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { digitsFromTelInput, formatUsPhoneMask } from "@/lib/checkout-auth";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  weddingDate: "",
  comments: "",
  website: "",
};

function isValidEmail(value) {
  const v = String(value ?? "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
}

function clientFieldErrors(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(form.email)) errors.email = "Enter a valid email address.";
  const phoneDigits = digitsFromTelInput(form.phone);
  if (form.phone.trim() && phoneDigits.length > 0 && phoneDigits.length < 10) {
    errors.phone = "Enter all 10 digits, or leave phone blank.";
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

export default function ContactInquiryForm() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const colorScheme = light ? "light" : "dark";

  const labelClass = overlayChrome.checkoutLabelUppercase(light);
  const inputClass = overlayChrome.checkoutInputBase(light);
  const errorClass = overlayChrome.checkoutInlineError(light);

  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const minWeddingDate = useMemo(() => todayIsoDate(), []);

  const errors = clientFieldErrors(form);
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
      name: true,
      email: true,
      phone: true,
      weddingDate: true,
      comments: true,
    });

    const nextErrors = clientFieldErrors(form);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/contact/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const successCopy = light ? "text-emerald-800" : "text-emerald-300/95";

  return (
    <Card variant="inset" className="min-w-0 w-full" title="Send an inquiry" titleTag="h2">
      <p
        className={
          light
            ? "mt-2 text-sm leading-7 text-stone-600"
            : "mt-2 text-sm leading-7 text-stone-400"
        }
      >
        Share a few details and I will reply to you at the email you provide — usually within
        one to two business days.
      </p>

      {status === "success" ? (
        <p className={`mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm ${successCopy}`} role="status">
          Thank you — your message is on its way. I will be in touch soon.
        </p>
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
        </div>

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
                value={form.phone}
                onChange={handlePhoneChange}
                onBlur={() => markTouched("phone")}
                className={inputClass}
                placeholder="(410) 555-0123"
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
            id="contact-wedding-date"
            label="Wedding date"
            name="weddingDate"
            value={form.weddingDate}
            onChange={(e) => update("weddingDate", e.target.value)}
            min={minWeddingDate}
            labelClassName={labelClass}
            inputClassName={inputClass}
            colorScheme={colorScheme}
          />
        </div>

        <div>
          <label htmlFor="contact-comments" className={labelClass}>
            Comments
            <textarea
              id="contact-comments"
              name="comments"
              rows={4}
              value={form.comments}
              onChange={(e) => update("comments", e.target.value)}
              className={`${inputClass} resize-y min-h-[6.5rem]`}
              placeholder="Tell me about your celebration, location, or anything else that would help."
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
            {submitting ? "Sending…" : "Send message"}
          </PrimaryButton>
          <p className={light ? "text-xs text-stone-500" : "text-xs text-stone-500"}>
            Or email{" "}
            <a
              href={`mailto:${orgInquiryEmail}`}
              className="underline decoration-stone-500/40 underline-offset-2 transition hover:text-amber-300/90"
            >
              {orgInquiryEmail}
            </a>{" "}
            directly.
          </p>
        </div>
      </form>
    </Card>
  );
}
