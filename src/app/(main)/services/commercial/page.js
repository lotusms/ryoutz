import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Commercial Photography"),
  description: `Commercial photography by ${orgLegalName} — brand campaigns, product photography, editorial, and real estate shoots, planned with care and shot with the same attention given to a wedding morning.`,
};

const lead = [
  "Brand campaigns, product photography, editorial, real estate, and architectural work — commercial shoots made with the same attention I bring to a wedding morning. Briefs are welcome, references encouraged, but improvisation stays part of the craft.",
  "Whether it's a launch campaign, a refreshed website, a magazine assignment, or a property that needs to sell itself in the first frame, the goal is the same: photographs that work for your audience and look like they belong to your brand — not to a stock library.",
];

const inclusions = {
  items: [
    "Pre-production planning: mood boards, shot lists, locations, and casting",
    "On-set art direction and continuous lighting tailored to the brand",
    "Tethered shooting with real-time client review on a calibrated display",
    "Retouched, high-resolution deliverables prepared for print and web",
    "Crop variants for social, web hero, and print-ready master files",
    "Usage and licensing structured to your campaign and territories",
  ],
};

const process = {
  steps: [
    {
      title: "Brief",
      body: "Goals, audience, references, deliverables, and any deadlines that anchor the rest of the schedule.",
    },
    {
      title: "Pre-production",
      body: "Locations, talent, props, permits, and a shot list refined until everyone knows the day.",
    },
    {
      title: "Shoot day",
      body: "Calm set, focused work, and enough room left in the schedule for happy accidents — the ones that often end up as the hero frame.",
    },
    {
      title: "Post",
      body: "Selection review, retouching, color, and final delivery in the formats your team actually uses.",
    },
  ],
};

export default function CommercialPage() {
  return (
    <PageLayout
      eyebrow="Services / Commercial"
      title="Commercial"
      subtitle="Brand, product, editorial, and architectural photography for teams who want images that look like their brand — not someone else's stock library."
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="A commercial photograph still has to be a photograph first — honest light, real surfaces, a point of view someone made on purpose."
          cta={{
            primaryHref: "/contact",
            primaryLabel: "Send a brief",
            secondaryHref: "/gallery",
            secondaryLabel: "Browse the gallery",
          }}
        />
      </div>
    </PageLayout>
  );
}
