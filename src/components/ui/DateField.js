"use client";

import { useId } from "react";

/**
 * Native date picker styled to match checkout / auth form fields.
 *
 * @param {{
 *   id?: string;
 *   label?: string;
 *   name?: string;
 *   value: string;
 *   onChange: import("react").ChangeEventHandler<HTMLInputElement>;
 *   min?: string;
 *   max?: string;
 *   required?: boolean;
 *   disabled?: boolean;
 *   className?: string;
 *   inputClassName?: string;
 *   labelClassName?: string;
 *   colorScheme?: "light" | "dark";
 * }} props
 */
export default function DateField({
  id,
  label,
  name = "date",
  value,
  onChange,
  min,
  max,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "",
  labelClassName = "block text-xs font-medium uppercase tracking-wider text-slate-500",
  colorScheme = "dark",
}) {
  const fallbackId = useId();
  const inputId = id ?? `date-${fallbackId}`;
  const schemeClass =
    colorScheme === "light" ? "[color-scheme:light]" : "[color-scheme:dark]";

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className={labelClassName}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        className={`${label ? "mt-1.5" : ""} ${schemeClass} ${inputClassName}`.trim()}
      />
    </div>
  );
}
