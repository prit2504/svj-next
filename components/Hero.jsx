// components/Hero.jsx
"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-4 mt-5 bg-gradient-to-r from-[#fffaf5] to-[#fdf3e7] rounded-2xl p-10 shadow-xl text-center">
      <div
        className="relative z-10 px-4 animate-fadeIn"
        style={{ animation: "fadeIn 0.7s ease-out" }}
      >
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#B76E79] mb-4 leading-snug">
          Welcome to <br />
          Shree Vagheswari Jewellers
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore our handcrafted jewellery collections, blending tradition and
          modern design for every special occasion.
        </p>
        <Link
          href="#categories"
          className="bg-gradient-to-r from-[#B76E79] to-[#E3C396] text-white px-8 py-3 rounded-full font-medium shadow-md hover:opacity-90 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
