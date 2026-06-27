import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, serviceAreaProse } from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Line Painting",
  description: `Line painting and pavement striping by ${orgLegalName}. Parking lots, drive lanes, and traffic markings with crisp, durable lines in ${serviceAreaProse}.`,
  path: "/services/line-painting",
});

const lead = [
  "Fresh striping makes a lot easier to navigate, safer for traffic flow, and more professional for tenants and customers. Faded or missing lines create confusion — and they signal neglect before anyone reads a sign.",
  "We lay out stalls, lanes, arrows, and compliance markings to your plan or local requirements, then apply durable traffic paint for sharp edges and consistent coverage. Surfaces are cleaned and dry before any line goes down.",
];

const inclusions = {
  items: [
    "Layout planning for stalls, aisles, arrows, handicap spaces, and fire lanes",
    "Surface cleaning and dry-time verification before striping",
    "Handicap symbols, stencils, and directional markings as specified",
    "Commercial-grade traffic paint for parking lots and private drives",
    "Re-striping over existing layouts or updated layouts after resurfacing",
    "Optional sealcoating coordination so lines go on a fresh, uniform surface",
  ],
};

const process = {
  steps: [
    {
      title: "Layout",
      body: "Confirm stall counts, traffic flow, and any code requirements — then chalk or tape the plan on site.",
    },
    {
      title: "Prep",
      body: "Clean the pavement and verify the surface is dry so paint adheres and cures properly.",
    },
    {
      title: "Striping",
      body: "Apply lines, symbols, and markings with consistent width, spacing, and sharp terminal points.",
    },
    {
      title: "Cure",
      body: "Hold traffic until paint is cured enough for your use pattern — we will tell you when cars can return.",
    },
  ],
};

const cta = {
  primaryHref: "/contact",
  primaryLabel: "Get a free estimate",
  secondaryHref: "/gallery",
  secondaryLabel: "See our work",
};

const heroImage = "/images/services/linepainting.png";
const heroImageAlt = "Fresh lane markings on a paved road";

export default function LinePaintingPage() {
  return (
    <PageLayout
      eyebrow="Services / Line Painting"
      title="Line Painting"
      subtitle="Crisp parking lot striping, lane markings, and traffic paint for commercial lots, private drives, and properties that need clear, durable lines."
      width="full"
      heroImage={heroImage}
      heroImageAlt={heroImageAlt}
      heroImagePosition="center 55%"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="A parking lot with sharp lines reads as managed property — faded stripes cost you credibility before they cost you a citation."
          cta={cta}
        />
      </div>
    </PageLayout>
  );
}
