import LandingPage from "~/components/Hero";
import AnimatedWaveBackground from "~/components/AnimatedWaveBackground";
import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Splinter - League Dashboard" },
    { name: "description", content: "Welcome to Splinter, your personalized League of Legends dashboard." },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="relative flex-grow">
        {/* Animated background positioned behind the main content */}
        <AnimatedWaveBackground />
        {/* LandingPage container placed above the background */}
        <div className="relative z-10">
          <LandingPage />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}