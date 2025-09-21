// components/OfferBanner.jsx
"use client";

import Image from "next/image";

export default function OfferBanner() {
    return (
        <section className="mx-4 my-4">
            <div className="max-w-6xl mx-auto">
                {/* Container with proper relative positioning */}
                <div className="relative w-full aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg">

                    {/* Mobile Image */}
                    <img src="/images/offer1.webp" alt="Special offer" className="w-full h-full object-cover block sm:hidden" />
                    {/* Desktop Image */}
                    <img src="/images/offer1.1.webp" alt="Special Offer" className="w-full h-full object-cover hidden sm:block" />
                </div>
            </div>
        </section>
    );
}
