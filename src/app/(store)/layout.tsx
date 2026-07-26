import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgeGate } from "@/components/AgeGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import { VisitBeacon } from "@/components/VisitBeacon";
import { TawkToChat } from "@/components/TawkToChat";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <AgeGate />
      <VisitBeacon />
      <TawkToChat />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
