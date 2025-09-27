"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loader state
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Cloudinary optimization helper
  const optimizeCloudinaryUrl = (url, width, height) => {
    if (!url) return "";
    if (!url.includes("res.cloudinary.com")) return url;
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
    );
  };

  // Detect mobile screen
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem("newArrivals");
    if (cached) {
      setNewArrivals(JSON.parse(cached));
      setLoading(false); // ✅ stop loader
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch("/api/new-arrivals");
        const data = await res.json();
        const arrivals = Object.entries(data.arrivals).map(([cat, products]) => ({
          category: cat,
          products,
        }));
        setNewArrivals(arrivals);
        sessionStorage.setItem("newArrivals", JSON.stringify(arrivals));
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        setLoading(false); // ✅ stop loader
      }
    }

    fetchData();
  }, []);

  const openModal = (product) => setModalProduct(product);

  // Categories to show initially
  const visibleCategories = showAll ? newArrivals : newArrivals.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 bg-gradient-to-r from-[#fffaf5] to-[#fdf3e7] rounded-2xl shadow-xl border border-red-300 relative">
      <h2 className="text-3xl font-bold text-center text-yellow-700 mb-8">
        New Arrivals
      </h2>

      {/* ✅ Loader for this section */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div
            className={`space-y-12 transition-all duration-500 ${
              showAll ? "max-h-full" : "max-h-[1200px] overflow-hidden relative"
            }`}
          >
            {visibleCategories.map(
              (catData, i) =>
                catData.products.length > 0 && (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-[#B76E79]">
                        {catData.category}
                      </h3>
                      <button
                        onClick={() =>
                          router.push(`/category/${encodeURIComponent(catData.category)}`)
                        }
                        className="text-sm text-yellow-700 hover:underline"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {(isMobile
                        ? catData.products.slice(0, 2) // ✅ mobile → 2 products
                        : catData.products.slice(0, 4) // ✅ desktop → 4 products
                      ).map((product) => (
                        <button
                          key={product._id}
                          onClick={() => openModal(product)}
                          className="group product-card flex flex-col overflow-hidden rounded-2xl shadow-md border border-[#f5e6d3] bg-gradient-to-br from-[#fffdf9] via-[#fff8f2] to-[#fff3ea] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="relative overflow-hidden w-full aspect-square">
                            <img
                              src={optimizeCloudinaryUrl(product.imageUrl, 400, 400)}
                              alt={product.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-lg"
                            />
                            <span
                              className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full shadow ${
                                product.inStock
                                  ? "bg-green-600 text-white"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {product.inStock ? "Available" : "Out of Stock"}
                            </span>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
                          </div>

                          <div className="p-4 flex flex-col flex-1 font-sans">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1 mb-1">
                              {product.title}
                            </h3>
                            {product.description && (
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            <div className="footer border-t border-gray-200 pt-3 mt-2 text-sm space-y-1">
                              <div className="text-gray-500 line-through">
                                MRP : ₹{product.mrp || "---"}
                              </div>
                              <div className="text-gray-800 font-medium">
                                Price : ₹{product.price || "---"}{" "}
                                <span className="text-green-600 font-semibold">
                                  (
                                  {product.mrp && product.price
                                    ? Math.round(
                                        ((product.mrp - product.price) /
                                          product.mrp) *
                                          100
                                      )
                                    : 0}
                                  % OFF)
                                </span>
                              </div>
                              <div className="text-yellow-600 font-medium">
                                Extra 10% OFF applied
                              </div>
                              <div className="text-green-700 font-bold">
                                Final Price : ₹
                                {product.price
                                  ? Math.round(product.price - product.price * 0.1)
                                  : "---"}
                              </div>
                              <div
                                className="mt-3 bg-[#B76E79] text-white px-4 py-1.5 rounded-md shadow hover:opacity-90 transition text-center cursor-pointer"
                                onClick={() => openModal(product)}
                              >
                                View
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
            )}

            {!showAll && newArrivals.length > 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fffaf5] to-transparent pointer-events-none" />
            )}
          </div>

          {newArrivals.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2 bg-yellow-700 text-white rounded-full font-medium hover:bg-yellow-800 transition transform hover:scale-105 shadow-md"
              >
                {showAll ? "Show Less ↑" : "Show More ↓"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal unchanged */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-auto"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-white/80 w-full max-w-3xl rounded-xl shadow-xl p-4 sm:p-6 md:p-6 relative flex flex-col md:flex-row gap-4 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalProduct.imageUrl}
              alt={modalProduct.title}
              className="w-full md:w-1/2 h-auto object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 flex flex-col">
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
              <p className="text-gray-800 font-semibold text-sm sm:text-base">
                Price: ₹{modalProduct.price || "---"} (
                {modalProduct.mrp && modalProduct.price
                  ? Math.round(
                      ((modalProduct.mrp - modalProduct.price) /
                        modalProduct.mrp) *
                        100
                    )
                  : 0}
                % OFF)
              </p>
              <p className="text-yellow-600 font-medium text-sm sm:text-base mb-2">
                Extra 10% OFF applied
              </p>
              <p className="text-green-700 font-bold text-base sm:text-lg mb-4">
                Final Price: ₹
                {modalProduct.price
                  ? Math.round(modalProduct.price * 0.9)
                  : "---"}
              </p>
              {modalProduct.inStock ? (
                <a
                  href={`https://wa.me/${
                    process.env.NEXT_PUBLIC_SHOP_WHATSAPP
                  }?text=${encodeURIComponent(
                    `Hello! I'm interested in this product: ${modalProduct.title}. Link : ${window.location.origin}/product/${modalProduct._id}`
                  )}`}
                  target="_blank"
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
                onClick={() => setModalProduct(null)}
                className="absolute top-3 right-5 sm:top-4 sm:right-4 text-red-500 hover:text-red-300 text-4xl sm:text-3xl font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
