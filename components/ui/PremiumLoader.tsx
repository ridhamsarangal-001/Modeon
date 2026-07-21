"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium fullscreen initial loading curtain.
 * Staggers the serif logo characters, slides up the panel,
 * and remembers the session state to prevent repeating on local page updates.
 */
export function PremiumLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent flash on subsequent internal navigations
    const hasLoaded = sessionStorage.getItem("modeon-loaded");
    if (hasLoaded) {
      setTimeout(() => {
        setIsVisible(false);
      }, 0);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("modeon-loaded", "true");
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const logoLetters = "MODEON".split("");

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // Slow luxury ease
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: "-100%",
            transition: {
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1] as [number, number, number, number], // Custom slow ease
            },
          }}
          className="fixed inset-0 z-50 bg-[#F5F3EF] flex flex-col items-center justify-center select-none"
        >
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="flex items-center gap-[0.2em]"
          >
            {logoLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="font-display text-[32px] md:text-[44px] font-normal tracking-[0.2em] text-[#1a1a1a] uppercase leading-none block"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.0, duration: 1.0 }}
            className="font-sans text-[11px] uppercase tracking-widest text-[#1a1a1a] mt-space-3 font-semibold"
          >
            Considered Pieces
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
