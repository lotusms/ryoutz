import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { orgName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Work"),
  description: `How ${orgName} designs and releases home-training apparel built for comfort and consistency.`,
};

const pillars = [
  {
    title: "Movement-first fits",
    body:
      "Each piece is shaped to move naturally through squats, stretches, and floor work common in home training.",
  },
  {
    title: "Comfort you can repeat",
    body:
      "Soft hand feel, breathable fabric, and reliable support help you stay consistent without sacrificing comfort.",
  },
  {
    title: "Practical everyday wear",
    body:
      "Our apparel is designed for workout sessions and daily routines, so your gear works beyond the training window.",
  },
];

const stats = [
  { value: "Home", label: "training-focused design" },
  { value: "Soft", label: "comfort-led fabric choices" },
  { value: "Ready", label: "built for daily movement" },
];

export default function WorkPage() {
  return (
    <PageLayout
      eyebrow="Product Philosophy"
      title="Work"
      subtitle="A comfort-first collection designed for people who train hard at home."
      width="wide"
    >
      <p className="max-w-3xl text-lg leading-relaxed text-amber-200/95 sm:text-xl sm:leading-8">
        {orgName} is built around one idea: you should feel comfortable enough to train
        consistently and confident enough to stay focused on your goals.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border-2 border-slate-700/40 bg-slate-900/45 p-5 shadow-lg shadow-slate-950/30 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:shadow-slate-900/40"
          >
            <p className="bg-linear-to-br from-white via-amber-100 to-blue-200 bg-clip-text text-2xl font-semibold tracking-[-0.04em] text-transparent sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {pillars.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border-2 border-slate-700/35 bg-slate-900/50 p-6 backdrop-blur-sm transition duration-300 hover:border-blue-400/25 hover:bg-slate-800/40"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-blue-300/90">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-amber-200/90">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="rounded-4xl border-2 border-slate-600/35 bg-linear-to-br from-slate-800/40 via-slate-900/35 to-slate-950/50 p-8 shadow-xl shadow-slate-950/35 ring-2 ring-slate-500/20 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.32em] text-blue-300">
          Preview on the homepage
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-amber-200/90">
          The homepage collection preview highlights current apparel drops so you can quickly
          browse new pieces designed for home workouts, recovery, and everyday movement.
        </p>
        <Link
          href="/#collection"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-200/90 transition hover:text-blue-100"
        >
          <span className="border-b border-blue-400/40 pb-0.5">
            Jump to collection preview
          </span>
          <span aria-hidden className="text-lg leading-none">
            →
          </span>
        </Link>
      </div>
    </PageLayout>
  );
}
