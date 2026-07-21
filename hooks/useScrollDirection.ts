import { useState, useEffect, useRef } from "react";

export type ScrollDirection = "up" | "down" | "top";

/**
 * Smart sticky header scroll direction hook with baseline comparison.
 * Tracks the scroll coordinate baseline to evaluate net direction changes.
 * Immune to scroll bounce, mousewheel stutter, and high-frequency noise.
 */
export function useScrollDirection(threshold = 10, scrollTopOffset = 20) {
  // Initialize state directly from current window scroll offset to avoid hydration mismatches or linter alerts
  const [scrollDir, setScrollDir] = useState<ScrollDirection>(() => {
    if (typeof window === "undefined") return "top";
    return window.scrollY <= scrollTopOffset ? "top" : "up";
  });

  const scrollBaseline = useRef(0);
  const lastDir = useRef<ScrollDirection>(
    typeof window === "undefined"
      ? "top"
      : window.scrollY <= scrollTopOffset
      ? "top"
      : "up"
  );

  useEffect(() => {
    scrollBaseline.current = window.scrollY;
    lastDir.current = window.scrollY <= scrollTopOffset ? "top" : "up";

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= scrollTopOffset) {
        if (lastDir.current !== "top") {
          lastDir.current = "top";
          setScrollDir("top");
        }
        scrollBaseline.current = currentY;
        return;
      }

      // Handle transitions based on current direction state
      if (lastDir.current === "down") {
        if (currentY < scrollBaseline.current - threshold) {
          // Scrolled up past threshold -> Show header
          lastDir.current = "up";
          setScrollDir("up");
          scrollBaseline.current = currentY;
        } else if (currentY > scrollBaseline.current) {
          // Scrolled deeper down -> Follow the bottom edge
          scrollBaseline.current = currentY;
        }
      } else {
        // Current state is "up" or "top"
        if (currentY > scrollBaseline.current + threshold) {
          // Scrolled down past threshold -> Hide header
          lastDir.current = "down";
          setScrollDir("down");
          scrollBaseline.current = currentY;
        } else if (currentY < scrollBaseline.current) {
          // Scrolled higher up -> Follow the top edge
          scrollBaseline.current = currentY;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, scrollTopOffset]);

  return scrollDir;
}
