import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgeGate } from "@/components/AgeGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import { VisitBeacon } from "@/components/VisitBeacon";
import { TawkToChat } from "@/components/TawkToChat";
import { JsonLd } from "@/components/JsonLd";
import { SettingsProvider } from "@/components/SettingsProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <div className="flex min-h-dvh flex-1 flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AgeGate />
        <VisitBeacon />
        <TawkToChat />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </div>
    </SettingsProvider>
  );
}
