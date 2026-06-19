import Image from "next/image";
import { useId } from "react";

const GRADIENTS = {
  blue: {
    id: "home-value-blue",
    stops: [
      { offset: "0%", color: "#5eb8ff" },
      { offset: "55%", color: "#2b8cff" },
      { offset: "100%", color: "#1e4fd6" },
    ],
  },
  amber: {
    id: "home-value-amber",
    stops: [
      { offset: "0%", color: "#ffe08a" },
      { offset: "55%", color: "#f5b942" },
      { offset: "100%", color: "#c2780a" },
    ],
  },
};

function GradientDefs({ accent, gradId }) {
  const grad = GRADIENTS[accent];
  return (
    <defs>
      <linearGradient id={gradId} x1="12%" y1="8%" x2="88%" y2="92%">
        {grad.stops.map((stop) => (
          <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
        ))}
      </linearGradient>
    </defs>
  );
}

function IconShell({ accent, className = "", children }) {
  const gradId = `home-value-${accent}-${useId().replace(/:/g, "")}`;
  const stroke = `url(#${gradId})`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <GradientDefs accent={accent} gradId={gradId} />
      {typeof children === "function" ? children(stroke) : children}
    </svg>
  );
}

const STROKE = {
  main: 2,
  check: 2.15,
};

/** Badge shield + check — Quality */
export function ValueBarShieldIcon({ className = "", accent = "blue" }) {
  return (
    <IconShell accent={accent} className={className}>
      {(stroke) => (
        <>
          <path
            d="M24 4.75 38.25 9.75V20.25c0 8.1-5.85 15.65-14.25 19.75C15.6 35.9 9.75 28.35 9.75 20.25V9.75L24 4.75Z"
            stroke={stroke}
            strokeWidth={STROKE.main}
            strokeLinejoin="round"
          />
          <path
            d="m17.25 22.75 5.1 5.1 8.65-9.1"
            stroke={stroke}
            strokeWidth={STROKE.check}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </IconShell>
  );
}

/** Sealant / oil drop — Protection */
export function ValueBarDropIcon({ className = "", accent = "amber" }) {
  return (
    <IconShell accent={accent} className={className}>
      {(stroke) => (
        <path
          d="M24 6.25c0 0-10.75 14.35-10.75 22.5 0 5.95 4.75 10.75 10.75 10.75s10.75-4.8 10.75-10.75C34.75 20.6 24 6.25 24 6.25Z"
          stroke={stroke}
          strokeWidth={STROKE.main}
          strokeLinejoin="round"
        />
      )}
    </IconShell>
  );
}

/** History / schedule clock — uses provided reference artwork — Reliable */
export function ValueBarClockIcon({ className = "" }) {
  return (
    <Image
      src="/images/icons/reliable-clock.png"
      alt=""
      width={48}
      height={48}
      className={className}
      aria-hidden
    />
  );
}

/** Perspective road — uses provided reference artwork — Smooth */
export function ValueBarRoadIcon({ className = "" }) {
  return (
    <Image
      src="/images/icons/smooth-road.png"
      alt=""
      width={48}
      height={48}
      className={className}
      aria-hidden
    />
  );
}
