"use client";

import Link from "next/link";

export default function ShopNotFound() {
  return (
    <main className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-10 flex flex-col items-center justify-center text-center select-none min-h-[60vh] bg-transparent">
      <div className="max-w-md flex flex-col items-center gap-space-4">
        <span className="font-sans text-micro tracking-[0.25em] uppercase text-neutral-400 font-semibold">
          Error
        </span>
        <h1 className="font-display text-[48px] md:text-[64px] leading-none font-normal text-neutral-900 tracking-tight">
          404
        </h1>
        <h2 className="font-display text-h1 font-normal text-neutral-800 leading-tight">
          Page Not Found
        </h2>
        <p className="font-sans text-body text-neutral-500 leading-relaxed max-w-xs mt-space-1">
          The page you are looking for does not exist, or has been cataloged under a different collection.
        </p>
        <div className="mt-space-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white font-sans text-small font-semibold uppercase tracking-wider py-space-3 px-space-8 rounded-none transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
