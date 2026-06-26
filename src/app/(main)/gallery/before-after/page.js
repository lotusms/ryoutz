import PageLayout from "@/components/PageLayout";
import BeforeAfterShowcase from "@/components/gallery/BeforeAfterShowcase";
import { orgLegalName, orgName, serviceAreaProse, sitePageTitle } from "@/config";
import { getBeforeAfterPairsSync } from "@/lib/before-after";

export const metadata = {
  title: sitePageTitle("Before & After"),
  description: `Before and after asphalt transformations by ${orgLegalName} — see how sealcoating, crack repair, and maintenance restore driveways and parking lots.`,
};

export default function BeforeAfterPage() {
  const pairs = getBeforeAfterPairsSync();

  return (
    <PageLayout
      eyebrow="Transformations"
      title="Before & After"
      subtitle={`Drag each slider to compare worn pavement with the finished work from ${orgLegalName}. Real driveways and lots in ${serviceAreaProse} — restored surfaces that look sharp and hold up.`}
      width="full"
    >
      <BeforeAfterShowcase pairs={pairs} orgName={orgName} />
    </PageLayout>
  );
}
