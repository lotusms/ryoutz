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
      <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/10 max-[320px]:grid-cols-2 max-[320px]:divide-x-0 max-[320px]:divide-y">
        {VALUE_ITEMS.map((item, index) => {
          const Icon = item.Icon;

          return (
            <div
              key={item.title}
              className="relative flex flex-col items-center gap-1.5 px-2 py-3 text-center sm:gap-2 sm:px-3 sm:py-4 lg:flex-row lg:items-center lg:gap-4 lg:px-7 lg:py-6 lg:text-left"
            >
              {index > 0 ? <SlantDivider /> : null}

              <Icon
                accent={item.accent}
                className="h-8 w-8 shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
              />

              <div className="min-w-0">
                <p className="font-serif text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white sm:text-xs sm:tracking-[0.22em] lg:text-sm lg:tracking-[0.28em]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[0.58rem] leading-tight text-neutral-200/90 sm:mt-1 sm:text-[0.65rem] sm:leading-snug lg:text-sm">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
