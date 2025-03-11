import SummonerPage from '../components/summonerPage';
import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Summoner Search - Splinter" },
    { name: "description", content: "Search for League of Legends summoner data and match history." },
  ];
}

export default function SummonerRoute() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="relative flex-grow">
        <div className="relative z-10">
          <SummonerPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}