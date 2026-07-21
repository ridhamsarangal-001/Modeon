import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeadingH2, TextSmall } from "@/components/ui/Typography";

/**
 * InstagramGallery component.
 * Visual seamless social grid showcasing editorial layouts.
 */
export function InstagramGallery() {
  const photos = [
    { src: "/assets/images/collections/men-essentials.jpg", alt: "Editorial look men essentials" },
    { src: "/assets/images/collections/men-signature.jpg", alt: "Signature men blazer details" },
    { src: "/assets/images/collections/women-signature.jpg", alt: "Silk shirts drape look" },
    { src: "/assets/images/collections/men-limited.jpg", alt: "Tailored outerwear campaign details" },
    { src: "/assets/images/collections/men-seasonal.jpg", alt: "Autumn seasonal knit fabrics" }
  ];

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark select-none">
      <Container className="flex flex-col gap-space-4">
        {/* Title row */}
        <div className="flex flex-col gap-1">
          <HeadingH2 className="text-h2 font-semibold">
            The Circle Journal
          </HeadingH2>
          <TextSmall className="text-muted">
            Quiet moments captured by our lookbook styling team.
          </TextSmall>
        </div>

        {/* Seamless Grid wrapper */}
        <div className="flex gap-space-3 overflow-x-auto scrollbar-none py-1 sm:grid sm:grid-cols-3 lg:grid-cols-5 md:gap-space-4 -mx-space-4 px-space-4 sm:mx-0 sm:px-0">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="relative aspect-square w-40 sm:w-full overflow-hidden rounded-base border border-border/10 bg-surface dark:bg-surface-dark group cursor-pointer shrink-0 sm:shrink"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center group-hover:scale-104 group-hover:brightness-[0.85] transition-all duration-500 ease-out-quart"
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

InstagramGallery.displayName = "InstagramGallery";
