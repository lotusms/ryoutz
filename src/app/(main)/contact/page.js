import ContactInquiryForm from "@/components/contact/ContactInquiryForm";
import ContactServiceAreaMap from "@/components/contact/ContactServiceAreaMap";
import PageLayout from "@/components/PageLayout";
import { orgLegalName, orgName, serviceAreaProse } from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: `Request a free asphalt maintenance estimate from ${orgLegalName}. Sealcoating, crack repair, patching, and line striping for driveways, parking lots, and private roads in ${serviceAreaProse}.`,
  path: "/contact",
});

const checklist = [
  "Property address or nearest cross streets, plus city or county",
  "Type of surface: residential driveway, parking lot, private road, or other",
  "Approximate size if you know it — square footage, number of spaces, or lane length",
  "What you need: sealcoating, crack filling, patching, striping, or a full walkthrough",
  "Your preferred timing — urgent repair, this season, or flexible on schedule",
  "Photos of problem areas or recent work nearby (optional, but helpful for a faster quote)",
];

export default function ContactPage() {
  return (
    <PageLayout
      eyebrow="Get in touch"
      title="Request a free estimate"
      subtitle={`Tell us about your driveway, parking lot, or private road and we will follow up with a clear scope and quote. ${orgName} serves ${serviceAreaProse} for sealcoating, crack repair, patching, and line striping — residential and commercial. Every inquiry is read personally; expect a reply within 48 hours.`}
      width="full"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <ContactInquiryForm lines={checklist} />

        <div className="mt-12">
          <ContactServiceAreaMap />
        </div>
      </div>
    </PageLayout>
  );
}
