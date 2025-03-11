import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Splinter - League Dashboard" },
    { name: "description", content: "Welcome to Splinter, your personalized League of Legends dashboard." },
  ];
}

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          <main className="relative flex-grow">
          
            <div className="relative z-10">
             
            </div>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      );
    }