import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, serviceAreaProse } from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Pavement Maintenance",
  description: `Ongoing pavement maintenance by ${orgLegalName}. Scheduled sealcoating, hot poly fiber tar crack filling, patching, and striping in ${serviceAreaProse}.`,
  path: "/services/pavement-maintenance",
});

const lead = [
  "Pavement maintenance is the plan that keeps small issues from becoming capital projects. Regular inspections, crack sealing, sealcoating on cycle, and timely patching extend the life of your asphalt and smooth out surprise repair bills.",
  "When cracks show up, we do not patch over them with cold material — we fill with hot poly fiber tar, heated to 370–390°F, so repairs bond to the asphalt and keep water out of the base. Combined with brush-applied coal tar sealcoating and timely patching, maintenance stays ahead of costly rebuilds.",
];

const inclusions = {
  items: [
    "Annual or seasonal pavement inspections with written recommendations",
    "Scheduled crack filling with hot poly fiber tar (370–390°F)",
    "Sealcoating on a cycle matched to traffic and sun exposure",
    "Pothole and patch repairs before they spread",
    "Line repainting and layout refresh as markings fade",
    "Priority scheduling for existing maintenance clients when urgent issues appear",
  ],
};

const process = {
  steps: [
    {
      title: "Inspect",
      body: "Walk the property, photograph problem areas, and document crack patterns, drainage, and wear zones.",
    },
    {
      title: "Plan",
      body: "Prioritize work by urgency and budget — what protects the base now versus what can ride until next season.",
    },
    {
      title: "Execute",
      body: "Complete crack filling with hot poly fiber tar, sealcoating, patching, and striping on schedule — with clear communication before each visit.",
    },
    {
      title: "Follow up",
      body: "Leave notes on what was done, what to watch, and when the next maintenance window makes sense.",
    },
  ],
};

const cta = {
  primaryHref: "/contact",
  primaryLabel: "Get a free estimate",
  secondaryHref: "/gallery",
  secondaryLabel: "See our work",
};

const heroImage = "/images/services/pavement.png";
const heroImageAlt = "Commercial parking lot asphalt maintenance";

export default function PavementMaintenancePage() {
  return (
    <PageLayout
      eyebrow="Services / Pavement Maintenance"
      title="Pavement Maintenance"
      subtitle="Proactive care for driveways, parking lots, and private roads — scheduled inspections, repairs, and sealing to protect your pavement investment year after year."
      width="full"
      heroImage={heroImage}
      heroImageAlt={heroImageAlt}
      heroImagePosition="center 45%"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="Maintenance is not one big project — it is a sequence of small, timely fixes that keep a surface usable for years longer than neglect will allow."
          cta={cta}
        />
      </div>
    </PageLayout>
  );
}
