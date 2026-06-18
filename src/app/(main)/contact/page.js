import ContactInquiryForm from "@/components/contact/ContactInquiryForm";
import ContactInquiryPanel from "@/components/contact/ContactInquiryPanel";
import ContactServiceAreaMap from "@/components/contact/ContactServiceAreaMap";
import PageLayout from "@/components/PageLayout";
import { orgLegalName, orgName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Contact"),
  description: `Inquire about wedding photography, elopements, engagement and portrait sessions with ${orgLegalName}. Heart-led photography for couples who want to feel present on their day.`,
};

const checklist = [
  "Your wedding date, or your best estimate, and the city or region you are considering",
  "The kind of celebration: full wedding day, elopement, engagement, or portrait session",
  "A rough guest count and the venue name if you already have one in mind",
  "A few words about how you want the day to feel, quiet and intimate, lively and full of family, somewhere in between",
  "Any links, Pinterest boards, or photographs that have already moved you",
];

export default function ContactPage() {
  return (
    <PageLayout
      eyebrow="Let’s talk"
      title="Tell me about your day"
      subtitle={`If you are planning a wedding, an elopement, an engagement shoot, or a portrait session and you want a photographer who shows up early, stays kind, and leaves you with images that feel like the day really felt, you are in the right place. ${orgName} books a small number of celebrations each year so every couple gets the same patience and presence behind the camera. Send a note below; every inquiry is read personally, and you will hear back within a couple of days.`}
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ContactInquiryForm />

        <div className="mt-12">
          <ContactInquiryPanel lines={checklist} />
        </div>

        <div className="mt-12">
          <ContactServiceAreaMap />
        </div>
      </div>
    </PageLayout>
  );
}
