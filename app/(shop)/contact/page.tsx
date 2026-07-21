"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

export default function ContactPage() {
  const breadcrumbs = [{ label: "Contact" }];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F5F3EF] min-h-screen text-black select-none">
      {/* Breadcrumbs path */}
      <div className="border-b border-neutral-200/50 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-6 md:py-space-8">
        
        {/* Editorial Heading */}
        <div className="flex flex-col items-start gap-space-2 mb-space-8 max-w-xl">
          <span className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Concierge
          </span>
          <h1 className="font-display text-display leading-tight font-normal text-neutral-900">
            Private Shopping & Support
          </h1>
          <p className="font-sans text-body text-neutral-600 leading-relaxed mt-space-2">
            Whether you require assistance finding a size, tracking an order, or booking a private showroom viewing, our concierge is here to help.
          </p>
        </div>

        {/* Contact Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-8 md:gap-space-10 items-start">
          
          {/* Left Column: Direct Info Details */}
          <div className="lg:col-span-5 flex flex-col gap-space-6 lg:pr-space-5">
            <div>
              <h2 className="font-display text-h2 font-normal text-neutral-900 mb-space-2">
                Showroom & Office
              </h2>
              <p className="font-sans text-body text-neutral-600 leading-relaxed">
                Modeon Atelier<br />
                84 Rue de l&apos;Atelier, 75003<br />
                Paris, France
              </p>
            </div>

            <div>
              <h2 className="font-display text-h2 font-normal text-neutral-900 mb-space-2">
                Concierge Contact
              </h2>
              <p className="font-sans text-body text-neutral-600 leading-relaxed">
                support@modeon-fashion.com<br />
                +33 1 84 92 01 02
              </p>
            </div>

            <div>
              <h2 className="font-display text-h2 font-normal text-neutral-900 mb-space-2">
                Showroom Hours
              </h2>
              <p className="font-sans text-body text-neutral-600 leading-relaxed">
                Monday to Friday: 10:00 — 18:00 CET<br />
                Saturday: Private bookings only
              </p>
            </div>
          </div>

          {/* Right Column: Minimal Form */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-xs p-space-5 md:p-space-6 border border-neutral-200/50">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col gap-space-3 py-space-6 text-left"
              >
                <h3 className="font-display text-h2 font-normal text-neutral-900">
                  Reflections Received
                </h3>
                <p className="font-sans text-body text-neutral-600">
                  Thank you. Your inquiry has been routed to our concierge. We will respond within 24 business hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-space-4">
                <div className="flex flex-col gap-space-2">
                  <label htmlFor="name" className="font-sans text-micro font-medium uppercase tracking-wider text-neutral-500">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-hidden px-space-3 py-space-2.5 font-sans text-small transition-colors text-neutral-900"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex flex-col gap-space-2">
                  <label htmlFor="email" className="font-sans text-micro font-medium uppercase tracking-wider text-neutral-500">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-hidden px-space-3 py-space-2.5 font-sans text-small transition-colors text-neutral-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex flex-col gap-space-2">
                  <label htmlFor="message" className="font-sans text-micro font-medium uppercase tracking-wider text-neutral-500">
                    Message
                  </label>
                  <textarea
                    required
                    id="message"
                    rows={6}
                    className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-hidden px-space-3 py-space-2.5 font-sans text-small transition-colors text-neutral-900 resize-none"
                    placeholder="How may we assist you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white font-sans text-small font-semibold uppercase tracking-wider py-space-3 mt-space-2 transition-colors cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
