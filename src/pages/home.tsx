import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Ticker from "@/components/ticker";
import Signals from "@/components/signals";
import Stats from "@/components/stats";
import VIP from "@/components/vip";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import SignalAlertBanner from "@/components/signal-alert-banner";

export default function Home() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <SignalAlertBanner />
      <Navbar />
      <Hero />
      <Ticker />
      <Signals />
      <Stats />
      <VIP />
      <Testimonials />
      <Footer />
    </div>
  );
}
