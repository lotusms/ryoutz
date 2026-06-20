import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Sealcoating"),
  description: `Professional sealcoating by ${orgLegalName} — protect driveways, parking lots, and private roads across Maryland with a clean, even finish that stands up to sun, oil, and weather.`,
};

const lead = [
  "Sealcoating is the most cost-effective way to protect asphalt before cracks, fading, and surface wear turn into bigger repairs. A properly applied coat shields against UV breakdown, moisture, and everyday traffic — and it makes the pavement look cared for again.",
  "We prep the surface first: blow off debris, treat oil spots, and address minor cracks so the sealer bonds cleanly. Then we apply commercial-grade sealer in even passes for a uniform finish you can count on season after season.",
];

const inclusions = {
  items: [
    "Site walkthrough and surface assessment before work begins",
    "Blowing, sweeping, and oil-spot treatment as needed",
    "Crack routing and filling for minor cracks prior to sealing",
    "Hand-cut edges and careful masking around curbs, garage aprons, and landscaping",
    "Two-coat or single-coat application matched to surface condition and use",
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
      body: "Apply sealer in controlled passes for even coverage, sharp edges, and a finish that looks intentional.",
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
      subtitle="Protect and refresh asphalt surfaces with a professional sealcoat application — driveways, parking lots, and private roads across Maryland and the surrounding region."
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
          pullQuote="A good sealcoat starts with prep nobody photographs — clean edges, filled cracks, and a surface ready to hold the finish."
          cta={cta}
        />
      </div>
    </PageLayout>
  );
}
