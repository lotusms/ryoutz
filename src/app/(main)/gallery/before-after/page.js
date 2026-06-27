import PageLayout from "@/components/PageLayout";
import BeforeAfterShowcase from "@/components/gallery/BeforeAfterShowcase";
import { orgLegalName, orgName, serviceAreaProse } from "@/config";
import { getBeforeAfterPairsSync } from "@/lib/before-after";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Before & After",
  description: `Before and after asphalt transformations by ${orgLegalName}. See how sealcoating, crack repair, and maintenance restore driveways and parking lots in ${serviceAreaProse}.`,
  path: "/gallery/before-after",
});

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
