import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Wedding Photography"),
  description: `Wedding photography by ${orgLegalName} — full-day storytelling for couples who want to feel present on their day and remember it the way it really felt.`,
};

const lead = [
  "From the quiet hours before the first look to the last spin on the dance floor, your wedding deserves a photographer who arrives early, stays kind, and stays out of the way. I document the day unrushed so the photographs feel like the day itself — not a template someone else picked.",
  "Every wedding is built around your timeline and the people in it. The work is calm, editorial, and always honest. No mood boards that erase who you are, no rapid-fire shot lists — just patience, warmth, and frames you will still want to open in twenty years.",
];

const inclusions = {
  items: [
    "Full-day coverage from getting ready through the reception send-off",
    "A second photographer for larger guest counts and split locations",
    "An engagement session before the wedding so the camera feels familiar",
    "High-resolution, color-graded online gallery delivered in four to six weeks",
    "Print release for personal use, with fine-art prints and albums available",
    "Personal timeline planning so light, family, and quiet moments all land",
  ],
};

const process = {
  steps: [
    {
      title: "Inquiry",
      body: "Share your date, your venue, and a sentence about how you want the day to feel. I respond personally within a couple of days.",
    },
    {
      title: "Planning",
      body: "We map the timeline together — light, locations, family portraits, and any quiet moments you've been imagining.",
    },
    {
      title: "Wedding day",
      body: "I arrive early, stay calm, and follow the day as it actually unfolds — not as a checklist.",
    },
    {
      title: "Gallery",
      body: "A personal preview within days, then the full gallery, plus optional fine-art prints and albums.",
    },
  ],
};

export default function WeddingsPage() {
  return (
    <PageLayout
      eyebrow="Services / Weddings"
      title="Weddings"
      subtitle="Full-day, heart-led wedding photography for couples who want the photographs to feel like the day really felt."
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="Your wedding is not a brand shoot. It is a day that only happens once, and the pictures should feel like yours."
          cta={{
            primaryHref: "/contact",
            primaryLabel: "Start the conversation",
            secondaryHref: "/gallery",
            secondaryLabel: "Browse the gallery",
          }}
        />
      </div>
    </PageLayout>
  );
}
