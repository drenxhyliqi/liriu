import { Hero } from "@/components/sections/hero";
import { HomepageStory } from "@/components/sections/homepage-story";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HomepageStory />
    </main>
  );
}
