import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Event Photography"),
  description: `Event photography by ${orgLegalName} — galas, fundraisers, corporate gatherings, milestone parties, and private celebrations, calmly and editorially covered.`,
};

const lead = [
  "Galas, fundraisers, corporate parties, milestone birthdays, retirement dinners, anniversary nights — events you'll want to remember the morning after and share with the people who couldn't be there. Coverage is calm and editorial, built around the way your guests actually move.",
  "I work quietly, dress for the room, and stay out of the way of the night you've planned. Posed group shots when you want them, candid storytelling throughout, and a gallery you'll be proud to put your name on.",
];

const inclusions = {
  items: [
    "Coverage tailored to the event's length, scale, and pace",
    "Candid storytelling alongside posed group shots when you want them",
    "Stage, speaker, and award coverage with discreet positioning",
    "Optional on-site previews for press, social, or sponsor decks",
    "Edited gallery delivered within ten business days",
    "Rush turnarounds and printed keepsakes available on request",
  ],
};

const process = {
  steps: [
    {
      title: "Briefing",
      body: "Share the date, venue, and key moments — speakers, honorees, sponsors, performances, the cake.",
    },
    {
      title: "Walkthrough",
      body: "Light, layout, and access reviewed in advance so nothing important is missed once doors open.",
    },
    {
      title: "Event night",
      body: "Calm coverage that respects your guests — long lenses for speeches, candids on the floor, posed when called for.",
    },
    {
      title: "Delivery",
      body: "Curated gallery, plus same-night sneak peeks if your team needs them for press or social.",
    },
  ],
};

export default function EventsPage() {
  return (
    <PageLayout
      eyebrow="Services / Events"
      title="Events"
      subtitle="Galas, fundraisers, corporate gatherings, and private celebrations — calmly and editorially documented from arrival to last toast."
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="Your event is more than a guest list — it's a room full of people you've worked hard to bring together. The photographs should remember that."
          cta={{
            primaryHref: "/contact",
            primaryLabel: "Discuss your event",
            secondaryHref: "/gallery",
            secondaryLabel: "Browse the gallery",
          }}
        />
      </div>
    </PageLayout>
  );
}
