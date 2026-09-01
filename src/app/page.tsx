import Hero from "@/components/home/Hero";
import Collections from "@/components/home/Collections";
import BestSellers from "@/components/home/BestSellers";
import InstagramFeed from "@/components/home/InstagramFeed";
import ContactStrip from "@/components/home/ContactStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <Collections />
      <BestSellers />
      <InstagramFeed />
      <ContactStrip />
    </main>
  );
}
