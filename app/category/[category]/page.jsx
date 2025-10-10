"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../globals.css";
import Navbar from "@/components/Navbar";

export default function CategoryPage() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || "");
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [showScroll, setShowScroll] = useState(false);


  const limit = 16;

  // Fetch products when category changes or on initial load
  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem(`category-${decodedCategory}`));
    if (savedState && savedState.products?.length > 0) {
      setProducts(savedState.products);
      setPage(savedState.page || 1);
      setPages(savedState.pages || 1);
      setTimeout(() => window.scrollTo(0, savedState.scrollY || 0), 0);
    } else {
      fetchProducts(1); // Fetch products if no valid saved state
    }
  }, [decodedCategory]);

  // Save state to sessionStorage
  useEffect(() => {
    const state = { products, page, pages, scrollY: window.scrollY };
    sessionStorage.setItem(`category-${decodedCategory}`, JSON.stringify(state));
  }, [products, page, pages, decodedCategory]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  async function fetchProducts(p = 1) {
    if (!decodedCategory) return; // Prevent fetch if category is undefined
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?category=${encodeURIComponent(decodedCategory)}&page=${p}&limit=${limit}`,
        { cache: "no-store" } // Ensure fresh data
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setPage(p);
    } catch (err) {
      console.error(`Error fetching products for category ${decodedCategory}:`, err);
      setProducts([]); // Reset products on error
      setPages(1);
    } finally {
      setLoading(false);
    }
  }

  function openModal(product) {
    setModalProduct(product);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setModalProduct(null);
    document.body.style.overflow = "auto";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-yellow-200 text-gray-700 rounded-full shadow transition"
      >
        ← Back
      </button>
      {/* Title */}
      <h2 className="text-2xl font-bold text-yellow-700 mb-6 text-center">
        { (decodedCategory == "Gente Kadi" ? "Gents Kadi" : decodedCategory) || "Category"} Collection
      </h2>

      {/* Products Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-6">
            <div className="w-12 h-12 border-4 border-[#E3C396] border-dashed rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No products found in {decodedCategory || "this category"}.
          </p>
        ) : (
          products.map((product) => (
            <button
              key={product._id}
              onClick={() => openModal(product)}
              className="group product-card flex flex-col overflow-hidden rounded-2xl shadow-md border border-[#f5e6d3] bg-gradient-to-br from-[#fffdf9] via-[#fff8f2] to-[#fff3ea] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden w-full aspect-square">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-lg"
                />
                <span
                  className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full shadow ${product.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
                >
                  {product.inStock ? "Available" : "Out of Stock"}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 font-sans">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1 mb-1">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                )}

                <div className="footer border-t border-gray-200 pt-3 mt-2 text-sm space-y-1">
                  <div className="text-gray-500 line-through">MRP : ₹{product.mrp || "---"}</div>
                  <div className="text-green-700 font-bold sm:text-xl">
                    Price : ₹{product.price || "---"}{" "}
                    <span className="text-green-700 font-bold sm:text-xl">
                      (
                      {product.mrp && product.price
                        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                        : 0}
                      % OFF)
                    </span>
                  </div>
                  {/* <div className="text-yellow-600 font-medium">Extra 10% OFF applied</div>
                  <div className="text-green-700 font-bold">
                    Final Price : ₹
                    {product.price ? Math.round(product.price * 0.9) : "---"}
                  </div> */}
                  <div className="mt-3 bg-[#B76E79] text-white px-4 py-1.5 rounded-md shadow hover:opacity-90 transition text-center">
                    View
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </section>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex flex-wrap justify-center mt-8 gap-3">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchProducts(i + 1)}
              className={`px-4 py-2 rounded-full ${page === i + 1
                ? "bg-yellow-500 text-white shadow-lg"
                : "bg-pink-100 text-gray-700 hover:bg-yellow-200"
                } transition`}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Scroll to top */}
      {!modalProduct && showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#B76E79] to-[#E3C396] p-3 rounded-full shadow-lg hover:scale-110 transition duration-300 z-50"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
      )}

      {/* Modal */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-4 sm:p-6 md:p-6 relative flex flex-col md:flex-row gap-4 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={modalProduct.imageUrl}
              alt={modalProduct.title}
              className="w-full md:w-1/2 h-auto object-cover rounded-lg flex-shrink-0"
              loading="lazy"
            />

            {/* Details */}
            <div className="flex-1 flex flex-col gap-5">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">
                {modalProduct.title}
              </h2>
              {modalProduct.description && (
                <p className="text-gray-700 mb-2 text-sm sm:text-base line-clamp-4">
                  {modalProduct.description}
                </p>
              )}
              <p className="line-through text-gray-500 text-sm sm:text-base">
                MRP: ₹{modalProduct.mrp || "---"}
              </p>
              <p className="text-green-700 font-bold text-sm sm:text-xl">
                Price: ₹{modalProduct.price || "---"} (
                {modalProduct.mrp && modalProduct.price
                  ? Math.round(((modalProduct.mrp - modalProduct.price) / modalProduct.mrp) * 100)
                  : 0}
                % OFF)
              </p>
              {/* <p className="text-yellow-600 font-medium text-sm sm:text-base mb-2">
                Extra 10% OFF applied
              </p>
              <p className="text-green-700 font-bold text-base sm:text-lg mb-4">
                Final Price: ₹{modalProduct.price ? Math.round(modalProduct.price * 0.9) : "---"}
              </p> */}
              {modalProduct.inStock ? (
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_SHOP_WHATSAPP}?text=${
                    `Hello! I'm interested in this product: ${modalProduct.title}. Link: ${window.location.origin}/product/${modalProduct._id}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center font-semibold transition transform hover:scale-105"
                >
                  Buy on WhatsApp
                </a>
              ) : (
                <span className="inline-block px-3 py-2 bg-red-100 text-red-600 rounded text-sm sm:text-base">
                  Out of Stock
                </span>
              )}

              <button
                onClick={closeModal}
                className="absolute top-3 right-5 sm:top-4 sm:right-4 text-red-500 hover:text-red-400 text-4xl sm:text-3xl font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}