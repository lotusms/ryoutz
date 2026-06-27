import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, serviceAreaProse } from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Crack Filling",
  description: `Hot poly fiber tar crack filling by ${orgLegalName}, heated to 370 to 390 degrees F, for durable crack seals on driveways, parking lots, and private roads in ${serviceAreaProse}.`,
  path: "/services/crack-filling",
});

const lead = [
  "Cracks are how water gets under your pavement — and freeze-thaw cycles do the rest. Routing and filling cracks early keeps small problems from becoming potholes, alligatoring, and full resurfacing jobs.",
  "We fill cracks with hot poly fiber tar, heated to 370–390°F and applied while it flows into the repair. That heat helps the material bond to the asphalt, flex with the pavement, and seal moisture out of the base — for a tight, flush repair that holds up in Pennsylvania weather and traffic.",
];

const inclusions = {
  items: [
    "Visual survey of crack patterns and pavement condition",
    "Blowing and cleaning cracks before any material goes in",
    "Mechanical routing on eligible cracks for deeper, longer-lasting seals",
    "Hot poly fiber tar heated to 370–390°F and applied while hot for full penetration",
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
      body: "Heat poly fiber tar to 370–390°F, route where needed, and fill cracks while the material is hot so it bonds deep and seals moisture out of the base.",
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
      subtitle={`Hot poly fiber tar crack filling — heated to 370–390°F and applied while hot — for driveways, parking lots, and private roads in ${serviceAreaProse}.`}
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
          pullQuote="Hot poly fiber tar at 370–390°F does not just sit on top of a crack — it bonds while it is hot and keeps water out of the base before winter does the expensive work."
          cta={cta}
        />
      </div>
    </PageLayout>
  );
}
