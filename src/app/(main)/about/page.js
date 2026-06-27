import AboutStudioCards from "@/components/about/AboutStudioCards";
import PageLayout from "@/components/PageLayout";
import { orgLegalName, orgName, serviceAreaProse } from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About",
  description: `Meet ${orgLegalName}, a third-generation family-owned asphalt maintenance company serving ${serviceAreaProse}. Honest estimates for sealcoating, crack repair, patching, and striping.`,
  path: "/about",
});

const principles = [
  {
    title: "Prep Before Product",
    body:
      "Clean surfaces, routed cracks, and solid adhesion matter as much as the sealcoat or patch itself. We do not skip the unglamorous steps that keep repairs from peeling off next season.",
  },
  {
    title: "Straight Answers",
    body:
      "We tell you what needs work now and what can wait. No pressure to replace pavement that still has life left — just a clear plan and a fair estimate you can compare.",
  },
  {
    title: "Built for Traffic & Weather",
    body:
      "Pennsylvania freeze-thaw cycles, sun, oil, and daily wear are part of the job. Every mix, repair, and application is chosen so your surface holds up through the seasons ahead.",
  },
];

export default function AboutPage() {
  return (
    <PageLayout
      eyebrow="About us"
      title={`About ${orgName}`}
      subtitle={`Family-owned asphalt maintenance serving ${serviceAreaProse} — driveways, parking lots, and private roads. Here is who we are, how we approach the work, and what you can expect from the first walkthrough to the final stripe.`}
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <AboutStudioCards orgName={orgName} principles={principles} />

        <p className="mx-auto mt-20 max-w-2xl border-l-2 border-blue-400 pl-6 text-sm leading-8 text-neutral-200/90 sm:mt-24">
          Same standard you see in our gallery: show up on time, protect what is
          around the work zone, and leave pavement that looks right and holds up
          season after season.
        </p>
      </div>
    </PageLayout>
  );
}
