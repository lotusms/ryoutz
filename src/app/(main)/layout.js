import JsonLd from "@/components/seo/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { localBusinessJsonLd, webSiteJsonLd } from "@/lib/seo";

export default function MainSiteLayout({ children }) {
  return (
    <>
      <JsonLd data={[localBusinessJsonLd(), webSiteJsonLd()]} />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
