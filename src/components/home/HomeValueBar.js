import {
  ValueBarClockIcon,
  ValueBarDropIcon,
  ValueBarRoadIcon,
  ValueBarShieldIcon,
} from "@/components/home/HomeValueBarIcons";

const VALUE_ITEMS = [
  {
    title: "Quality",
    subtext: "Built to Last",
    Icon: ValueBarShieldIcon,
    accent: "blue",
  },
  {
    title: "Protection",
    subtext: "Seal. Protect. Preserve.",
    Icon: ValueBarDropIcon,
    accent: "amber",
  },
  {
    title: "Reliable",
    subtext: "On Time. Every Time.",
    Icon: ValueBarClockIcon,
    accent: "blue",
  },
  {
    title: "Smooth",
    subtext: "Better Look. Better Drive.",
    Icon: ValueBarRoadIcon,
    accent: "amber",
  },
];

function SlantDivider() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-px top-3 bottom-3 hidden w-px origin-bottom skew-x-[-14deg] bg-slate-600/70 lg:block"
    />
  );
}

/**
 * Four-column value bar — sits at the bottom of the home hero (wireframe).
 */
export default function HomeValueBar({ className = "" }) {
  return (
    <div
      className={`relative z-10 border-t border-white/10 bg-black/85 backdrop-blur-md ${className}`.trim()}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_ITEMS.map((item, index) => {
          const Icon = item.Icon;

          return (
            <div
              key={item.title}
              className={`relative flex items-center gap-4 px-5 py-5 sm:py-6 lg:px-7 ${
                index >= 2 ? "border-t border-white/10 sm:border-t lg:border-t-0" : ""
              } ${index % 2 === 1 ? "sm:border-l sm:border-white/10 lg:border-l-0" : ""}`}
            >
              {index > 0 ? <SlantDivider /> : null}

              <Icon accent={item.accent} className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />

              <div className="min-w-0 text-left">
                <p className="font-serif text-sm font-bold uppercase tracking-[0.24em] text-white sm:tracking-[0.28em]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-snug text-neutral-200/90">{item.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
