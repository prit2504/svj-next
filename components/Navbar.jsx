"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToCategories = () => {
    // Navigates to home and scrolls to categories
    router.push("/#categories");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Shree Vagheswari Jewellers Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-xl sm:text-2xl font-bold text-[#B76E79]">
              Shree Vagheswari Jewellers
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-medium items-center">
            <Link href="/" className="hover:text-yellow-600 transition">
              Home
            </Link>
            <button
              onClick={scrollToCategories}
              className="hover:text-yellow-600 transition"
              aria-label="Go to Shop"
            >
              Shop
            </button>
            <Link
              href="/shop-location"
              className="hover:text-yellow-600 transition"
            >
              Address
            </Link>
            <a
              href="https://wa.me/message/YYDUQB5Y2PCTC1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition"
              aria-label="Contact via WhatsApp"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center text-gray-700 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden text-[#B76E79] bg-gradient-to-r from-[#fffaf5] to-[#fdf3e7] shadow-lg flex flex-col px-6 py-4 space-y-4 font-bold items-center mx-4 cursor-pointer">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <button
            onClick={() => {
              scrollToCategories();
              setMenuOpen(false);
            }}
          >
            Shop
          </button>
          <Link href="/shop-location" onClick={() => setMenuOpen(false)}>
            Address
          </Link>
          <a
            href="https://wa.me/message/YYDUQB5Y2PCTC1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
