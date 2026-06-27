import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, serviceAreaProse } from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Sealcoating",
  description: `Professional sealcoating by ${orgLegalName}. Single-coat coal tar sealer applied by brush in ${serviceAreaProse} for driveways, parking lots, and private roads.`,
  path: "/services/sealcoating",
});

const lead = [
  "Sealcoating is the most cost-effective way to protect asphalt before cracks, fading, and surface wear turn into bigger repairs. A properly applied coat shields against UV breakdown, moisture, and everyday traffic — and it makes the pavement look cared for again.",
  "We use coal tar sealer for a longer-lasting job. After prep, we apply a single coat by brush so the material is worked into every pore — not just sprayed on top — for stronger adhesion, a uniform finish, and protection you can count on season after season.",
];

const inclusions = {
  items: [
    "Site walkthrough and surface assessment before work begins",
    "Blowing, sweeping, and oil-spot treatment as needed",
    "Crack routing and filling for minor cracks prior to sealing",
    "Hand-cut edges and careful masking around curbs, garage aprons, and landscaping",
    "Single-coat coal tar sealer applied by brush to work into every pore",
    "Barricades and cure-time guidance so traffic returns at the right moment",
  ],
};

const process = {
  steps: [
    {
      title: "Estimate",
      body: "Share your address and surface type. We review size, condition, and access, then provide a clear written quote.",
    },
    {
      title: "Prep",
      body: "Clean the pavement, treat stains, and fill cracks so sealer adheres to sound asphalt — not loose grit.",
    },
    {
      title: "Application",
      body: "Brush-apply a single coat of coal tar sealer, working it into the asphalt for even coverage, sharp edges, and a longer-lasting finish.",
    },
    {
      title: "Cure & handoff",
      body: "Leave barricades in place for the recommended cure window and walk you through when the surface is ready for use.",
    },
  ],
};

const cta = {
  primaryHref: "/contact",
  primaryLabel: "Get a free estimate",
  secondaryHref: "/gallery",
  secondaryLabel: "See our work",
};

const heroImage = "/images/services/sealcoating.png";
const heroImageAlt =
  "Freshly sealcoated residential driveway at dusk";

export default function SealcoatingPage() {
  return (
    <PageLayout
      eyebrow="Services / Sealcoating"
      title="Sealcoating"
      subtitle={`Single-coat coal tar sealer applied by brush — driveways, parking lots, and private roads in ${serviceAreaProse}.`}
      width="full"
      heroImage={heroImage}
      heroImageAlt={heroImageAlt}
      heroImagePosition="center 42%"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="Coal tar sealer applied by brush — worked into every pore, not just sprayed on — is what makes a sealcoat last."
          cta={cta}
        />
      </div>
    </PageLayout>
  );
}
