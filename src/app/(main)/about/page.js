import AboutStudioCards from "@/components/about/AboutStudioCards";
import PageLayout from "@/components/PageLayout";
import { orgLegalName, orgName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("About"),
  description: `Meet ${orgLegalName} — wedding and portrait photographer focused on real moments, soft light, and heirloom images for couples who want to feel present on their day.`,
};

const principles = [
  {
    title: "Patience over Posing",
    body:
      "The best photographs often live in the seconds between plans, a hand on a shoulder, laughter you did not rehearse. I give you room to breathe so those moments have somewhere to land.",
  },
  {
    title: "Light that Flatters, Never Flat",
    body:
      "Whether it is sun through a window or candles at the end of the night, I work with what the day gives us so your skin, your dress, and the mood of the room all read true in the frame.",
  },
  {
    title: "Images You Will Still Open",
    body:
      "Years from now, you should not have to squint and remember what it felt like. The picture should carry some of the weight for you. That is the standard every gallery on this site is held to.",
  },
];

export default function AboutPage() {
  return (
    <PageLayout
      eyebrow="Hello"
      title={`About ${orgName}`}
      subtitle={`I photograph weddings, elopements, and the people you love, the unscripted parts as much as the ones you have been imagining since you said yes. This page is a little about who I am when I am not hiding behind a camera, and how I show up for you on the day itself.`}
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <AboutStudioCards orgName={orgName} principles={principles} />

        <p className="mx-auto mt-20 max-w-2xl border-l-2 border-amber-400/25 pl-6 text-sm leading-8 text-stone-300/90 sm:mt-24">
          Based in the same care you see in the gallery: show up early, stay kind, and leave you
          with photographs that feel like proof, not performance, of how the day really was.
        </p>
      </div>
    </PageLayout>
  );
}
