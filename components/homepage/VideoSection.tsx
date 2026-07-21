"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface VideoSectionProps {
  videoSrc?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Cinematic full-width video showcase component.
 * Autoplays, loops, mutes, and reveals with a soft viewport fade-in.
 */
export function VideoSection({ 
  videoSrc = "/assets/videos/fabric-detail.mp4",
  title = "The Art of Craft",
  subtitle = "Honoring the beauty of material and process."
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for strict browser autoplay permissions
      });
    }
  }, [videoSrc]);

  // Cascading layout variants
  const containerVariants = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // Slow luxury curve
      },
    },
  };

  return (
    <section className="w-full relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-black overflow-hidden select-none">
      
      {/* Background Video element with viewport reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.85 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="w-full h-full"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        />
      </motion.div>

      {/* Cinematic Text Overlay */}
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center p-space-4">
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-space-3 md:gap-space-4 text-white"
        >
          <motion.span 
            variants={itemVariants} 
            className="font-sans text-micro tracking-[0.25em] uppercase text-neutral-300 font-semibold"
          >
            Modeon Cinema
          </motion.span>
          <motion.h2 
            variants={itemVariants} 
            className="font-display text-[36px] md:text-[48px] lg:text-[60px] font-normal leading-tight tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="font-sans text-body md:text-body-lg text-neutral-300 font-normal tracking-wide max-w-lg leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>

    </section>
  );
}

VideoSection.displayName = "VideoSection";
