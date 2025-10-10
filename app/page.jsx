"use client";
import { useEffect } from "react";
import { useShop } from "../context/ShopContex";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ShopHome from "@/components/ShopHome"
import Footer from "@/components/Footer";
// import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
// import Pagination from "@/components/Pagination";
// import Footer from "@/components/Footer";

export default function HomePage() {
  const { category, search, page, setProducts, setPages } = useShop();

  async function fetchProducts() {
    const res = await fetch(`/api/products?category=${category}&search=${search}&page=${page}&limit=16`);
    const data = await res.json();
    setProducts(data.products);
    setPages(data.pages);
  }

  useEffect(() => {
    fetchProducts();
  }, [category, search, page]);

  return (
    <div className="bg-gradient-to-br from-[#fffdf9] via-[#fdf7f2] to-[#fffaf5]">

      <Hero />
      <ShopHome />


    </div>
  );
}
