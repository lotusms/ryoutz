import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function NotFound() {
  return (
    <PageLayout
      eyebrow="Gallery"
      title="Piece not found"
      subtitle="That image may have been removed or the link is outdated."
      width="wide"
    >
      <Link
        href="/gallery"
        className="inline-flex w-fit rounded-full border-2 border-slate-500/50 bg-slate-900/55 px-8 py-3.5 text-sm font-semibold text-amber-100 transition hover:border-blue-400/45"
      >
        Back to gallery
      </Link>
    </PageLayout>
  );
}
