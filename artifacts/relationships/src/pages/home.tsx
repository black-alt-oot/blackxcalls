import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Ticker from "@/components/ticker";
import Signals from "@/components/signals";
import Charts from "@/components/charts";
import Stats from "@/components/stats";
import Results from "@/components/results";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import SignalAlertBanner from "@/components/signal-alert-banner";
import TelegramFloat from "@/components/telegram-float";

export default function Home() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <SignalAlertBanner />
      <Navbar />
      <Hero />
      <Ticker />
      <Signals />
      <Charts />
      <Stats />
      <Results />
      <Testimonials />
      <Footer />
      <TelegramFloat />
    </div>
  );
}
