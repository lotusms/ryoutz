import PageLayout from "@/components/PageLayout";
import ServicePageBody from "@/components/services/ServicePageBody";
import { orgLegalName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Sporting Event Photography"),
  description: `Sports and sporting event photography by ${orgLegalName} — game-day coverage for teams, athletes, leagues, and sponsors with pro-grade telephoto lenses and fast turnarounds.`,
};

const lead = [
  "Games, tournaments, races, matches, and meets — on-the-action coverage with the long lenses, fast shutters, and timing the moment deserves. Photographs you can publish, frame, or hand to the athletes who earned them.",
  "Work delivered quickly enough to matter: tight selects for press the same night, full galleries for athletes and families within a day or two. Built for clubs, leagues, schools, sponsors, and the media outlets covering them.",
];

const inclusions = {
  items: [
    "High-frame-rate coverage with pro-grade telephoto and prime lenses",
    "Sideline, courtside, trackside, or pit-side access depending on the sport",
    "Action, reaction, and bench moments alongside team and athlete portraits",
    "Same-night sneak peeks for press, social, and sponsor reporting",
    "Full edited gallery delivered within 24–48 hours",
    "License options for clubs, sponsors, schools, and media outlets",
  ],
};

const process = {
  steps: [
    {
      title: "Inquiry",
      body: "Share the sport, level, venue, and what you need the images for — press, sponsors, athletes, or all of the above.",
    },
    {
      title: "Credentialing",
      body: "Venue access, media approvals, and any league-specific requirements lined up before game day.",
    },
    {
      title: "Coverage",
      body: "Angles, lenses, and positioning chosen for the moments your audience actually wants to see.",
    },
    {
      title: "Delivery",
      body: "Tight selects for immediate use, plus a full edited gallery with the depth athletes and families expect.",
    },
  ],
};

export default function SportingEventsPage() {
  return (
    <PageLayout
      eyebrow="Services / Sporting Events"
      title="Sporting Events"
      subtitle="Game-day photography for teams, athletes, leagues, and sponsors — pro-grade coverage delivered fast enough to actually use."
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ServicePageBody
          lead={lead}
          inclusions={inclusions}
          process={process}
          pullQuote="The best sports photographs aren't the ones that show the score — they're the ones that show what it cost."
          cta={{
            primaryHref: "/contact",
            primaryLabel: "Request coverage",
            secondaryHref: "/gallery",
            secondaryLabel: "Browse the gallery",
          }}
        />
      </div>
    </PageLayout>
  );
}
