"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#faf7f2] border-t border-[#E3C396]/30 text-[#6B5B4D] p-8 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
        {/* Address */}
        <div>
          <h3 className="text-[#B76E79] font-semibold mb-3">Address</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/shop-location" className="hover:underline text-gray-700">
                Shamal Bechor Pole, Vithhal Mandir Lane, B/h Bank Of Baroda, Mandvi, Vadodara. 390001
                <div className="font-bold underline">Click Here for Location</div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[#B76E79] font-semibold mb-3">Contact Us | Help</h3>
          <ul className="space-y-2">
            <li className="hover:text-[#E3C396] cursor-pointer">
              <a href="https://wa.me/message/YYDUQB5Y2PCTC1" target="_blank" rel="noopener noreferrer">
                WhatsApp
                <div className="font-bold underline">9313044246</div>
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-[#B76E79] font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2">
            <li className="hover:text-[#E3C396] cursor-pointer">
              <a href="https://www.instagram.com/1gram_vagheswari_jewellers" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li className="hover:text-[#E3C396] cursor-pointer">
              <a href="https://chat.whatsapp.com/GEScwwYBCmu7h8vUasRMdL" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-center mt-8 text-xs text-gray-500">
        © 2025 Shree Vagheswari Jewellers. All rights reserved.
      </p>

      {/* Scroll to Top Button */}
      
    </footer>
  );
}
