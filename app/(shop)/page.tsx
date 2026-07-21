import { Hero } from "@/components/homepage/Hero";
import { ProductCarousel } from "@/components/homepage/ProductCarousel";
import { FeaturedCampaign } from "@/components/homepage/FeaturedCampaign";
import { EditorialSections } from "@/components/homepage/EditorialSections";
import { VideoSection } from "@/components/homepage/VideoSection";

/**
 * Homepage Router Entry point.
 * Composes exactly the premium layouts requested:
 * - Single Hero
 * - New Arrivals (mixed products)
 * - Editorial sections
 * - Videos
 * - Featured Collection (FeaturedCampaign)
 * - Newsletter (inside Footer)
 */
export default async function Home() {
  return (
    <div className="flex flex-col w-full bg-background dark:bg-background-dark overflow-x-hidden">
      {/* 1. Single Hero */}
      <Hero />

      {/* 2. Welcome Video Section */}
      <VideoSection 
        videoSrc="/assets/videos/hero-video.mp4" 
        title="Atelier Campaign Lookbook" 
        subtitle="A seasonal reflection of movement and structural simplicity."
      />

      {/* 3. New Arrivals (mixed products carousel) */}
      <ProductCarousel />

      {/* 4. Lifestyle Video Section */}
      <VideoSection 
        videoSrc="/assets/videos/lifestyle-video.mp4" 
        title="Form & Texture" 
        subtitle="Designed to exist between the seasons, built to be layered."
      />

      {/* 5. Featured Collection / Campaign */}
      <FeaturedCampaign />

      {/* 6. Editorial Sections (all 6 lookbook blocks) */}
      <EditorialSections />

      {/* 7. Material Detail Video Section */}
      <VideoSection 
        videoSrc="/assets/videos/fabric-detail.mp4" 
        title="Materiality" 
        subtitle="Sourced from organic materials, woven by hand."
      />
    </div>
  );
}
