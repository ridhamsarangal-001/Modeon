/**
 * TypographicDivider horizontal marquee band.
 * Looping slogans belt across viewport.
 */
export function TypographicDivider() {
  const words = "MODEON EDITORIAL • TIMELESS DESIGNS • QUIET LUXURY • CONSIDERED PIECES • ESSENTIAL EDITS • QUIETLY MADE • ";

  return (
    <div
      className="w-full overflow-hidden bg-surface dark:bg-surface-dark border-y border-border dark:border-border-dark py-space-4 select-none"
      role="presentation"
    >
      <div className="flex whitespace-nowrap w-[200%] animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
        <span className="w-1/2 text-center font-display text-h3 md:text-h2 font-medium tracking-widest text-primary/60 uppercase">
          {words}
        </span>
        <span className="w-1/2 text-center font-display text-h3 md:text-h2 font-medium tracking-widest text-primary/60 uppercase">
          {words}
        </span>
      </div>
    </div>
  );
}

TypographicDivider.displayName = "TypographicDivider";
