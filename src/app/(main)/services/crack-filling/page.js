import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Crack Filling"),
  description: `Crack filling and sealing by ${orgLegalName} — stop water intrusion and pavement breakdown on driveways, parking lots, and private roads in Maryland.`,
};

const lead = [
  "Cracks are how water gets under your pavement — and freeze-thaw cycles do the rest. Routing and filling cracks early keeps small problems from becoming potholes, alligatoring, and full resurfacing jobs.",
  "We clean each crack, route where needed for better sealant adhesion, and fill with commercial-grade material rated for Maryland weather and traffic. The goal is a tight, flush repair that protects the base and blends with the surrounding surface.",
];

const inclusions = {
  items: [
    "Visual survey of crack patterns and pavement condition",
    "Blowing and cleaning cracks before any material goes in",
    "Mechanical routing on eligible cracks for deeper, longer-lasting seals",
    "Hot- or cold-applied crack sealant matched to crack width and use",
    "Hand tooling for flush finishes along edges and joints",
    "Recommendations for follow-up sealcoating or patching where needed",
  ],
};

const process = {
  steps: [
    {
      title: "Assessment",
      body: "Walk the surface with you, note crack types and severity, and explain what routing and filling will solve now versus later.",
    },
    {
      title: "Prep",
      body: "Clear debris and vegetation from cracks so sealant bonds to asphalt — not dust sitting on top.",
    },
    {
      title: "Fill",
      body: "Route, fill, and tool cracks for a clean, durable seal that keeps moisture out of the base.",
    },
    {
      title: "Review",
      body: "Walk the finished work with you and note any areas that may need sealcoating or patching in a future visit.",
    },
  ],
};

const cta = {
  primaryHref: "/contact",
  primaryLabel: "Get a free estimate",
  secondaryHref: "/gallery",
  secondaryLabel: "See our work",
};

const heroImage = "/images/services/crackfilling.png";
const heroImageAlt = "Worker filling cracks in asphalt pavement";

export default function CrackFillingPage() {
  return (
    <PageLayout
      eyebrow="Services / Crack Filling"
      title="Crack Filling"
      subtitle="Route, clean, and seal cracks before water and freeze-thaw cycles turn them into costly pavement failure — residential and commercial properties across Maryland."
      width="full"
      heroImage={heroImage}
      heroImageAlt={heroImageAlt}
      heroImagePosition="center 40%"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="The cheapest pavement repair is the crack you fill before winter — once water gets underneath, the price goes up fast."
          cta={cta}
        />
      </div>
    </PageLayout>
  );
}
