/**
 * AnnouncementBar horizontal banner.
 * Top thin strip with premium warm grey background (#E8E6E1) and 36px height.
 */
export function AnnouncementBar() {
  return (
    <div
      className="hidden md:flex w-full bg-[#E8E6E1] text-[#333] h-[36px] items-center px-space-4 md:px-space-5 select-none text-[11px] font-sans uppercase tracking-[0.05em] border-b border-neutral-300/40"
      role="region"
      aria-label="Promotional Announcement"
    >

      {/* Desktop: Centered announcement with right-aligned returns links */}
      <div className="hidden md:grid grid-cols-5 items-center w-full max-w-[1440px] mx-auto">
        <div className="col-span-1"></div>
        <div className="col-span-3 text-center font-normal">
          COMPLIMENTARY WORLDWIDE DELIVERY ON SELECTIONS OVER ₹15,000 — CONSIDERED PIECES, QUIETLY MADE.
        </div>
        <div className="col-span-1 text-right font-normal">
          COMPLIMENTARY RETURNS
        </div>
      </div>
    </div>
  );
}

AnnouncementBar.displayName = "AnnouncementBar";
