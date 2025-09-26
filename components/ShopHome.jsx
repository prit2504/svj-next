"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import debounce from "lodash/debounce";
import OfferBanner from "./OfferBanner";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import NewArrivals from "./NewArrivals";

export default function ShopHome() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  const productsContainerRef = useRef(null);
  const limit = 16;
  const STORAGE_KEY = "shopState";
  const productCache = useRef({}); // ✅ Cache for products

  // ---------------------------
  // Scroll & Save Scroll Position
  // ---------------------------
  const saveScrollPosition = useCallback(
    debounce(() => {
      const state = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, scrollY: window.scrollY })
      );
    }, 100),
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
      saveScrollPosition();
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      saveScrollPosition.cancel();
    };
  }, [saveScrollPosition]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------------------
  // Restore saved state
  // ---------------------------
  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (savedState) {
      setSelectedCategory(savedState.selectedCategory || "All");
      setSearchTerm(savedState.searchTerm || "");
      setProducts(savedState.products || []);
      setPage(savedState.page || 1);
      setPages(savedState.pages || 1);
      setSearchTriggered(savedState.searchTriggered || false);

      // Restore scroll
      const restoreScroll = () => {
        if (savedState.scrollY) window.scrollTo(0, savedState.scrollY);
      };
      requestAnimationFrame(restoreScroll);
    }
  }, []);

  // ---------------------------
  // Fetch categories with caching
  // ---------------------------
  useEffect(() => {
    async function fetchCategories() {
      const cached = sessionStorage.getItem("categoriesData");
      if (cached) {
        const { categories, categoryImages } = JSON.parse(cached);
        setCategories(categories);
        setCategoryImages(categoryImages);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        const newData = { categories: ["All", ...data.categories], categoryImages: data.categoryImages };
        setCategories(newData.categories);
        setCategoryImages(newData.categoryImages);
        sessionStorage.setItem("categoriesData", JSON.stringify(newData));
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // ---------------------------
  // Save state to sessionStorage
  // ---------------------------
  const saveState = useCallback(
    debounce(() => {
      const state = {
        selectedCategory,
        searchTerm,
        products,
        page,
        pages,
        searchTriggered,
        scrollY: window.scrollY,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 100),
    [selectedCategory, searchTerm, products, page, pages, searchTriggered]
  );

  useEffect(() => {
    saveState();
    return () => saveState.cancel();
  }, [selectedCategory, searchTerm, products, page, pages, searchTriggered, saveState]);

  // ---------------------------
  // Fetch products with caching
  // ---------------------------
  // const fetchProducts = useCallback(
  //   async (resetPage = true, targetPage = 1) => {
  //     const currentPage = resetPage ? 1 : targetPage;

  //     // ✅ Use cache if available
  //     const cacheKey = `${selectedCategory}-${searchTerm}-${currentPage}`;
  //     if (productCache.current[cacheKey]) {
  //       const { products, pages } = productCache.current[cacheKey];
  //       setProducts(products);
  //       setPages(pages);
  //       setPage(currentPage);
  //       setSearchTriggered(true);
  //       if (productsContainerRef.current) {
  //         productsContainerRef.current.scrollIntoView({ behavior: "smooth" });
  //       }
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const res = await fetch(
  //         `/api/products?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`
  //       );
  //       const data = await res.json();

  //       productCache.current[cacheKey] = data; // store in cache

  //       setProducts(data.products);
  //       setPages(data.pages);
  //       setPage(currentPage);
  //       setSearchTriggered(true);

  //       if (productsContainerRef.current) {
  //         productsContainerRef.current.scrollIntoView({ behavior: "smooth" });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching products:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   []
  // );
const fetchProducts = useCallback(
  async (resetPage = true, targetPage = 1) => {
    const currentPage = resetPage ? 1 : targetPage;

    const cacheKey = `${selectedCategory}-${searchTerm}-${currentPage}`;
    if (productCache.current[cacheKey]) {
      const { products, pages } = productCache.current[cacheKey];
      setProducts(products);
      setPages(pages);
      setPage(currentPage);
      setSearchTriggered(true);
      if (productsContainerRef.current) {
        productsContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(
          searchTerm
        )}&page=${currentPage}&limit=${limit}`
      );
      const data = await res.json();

      productCache.current[cacheKey] = data;

      setProducts(data.products);
      setPages(data.pages);
      setPage(currentPage);
      setSearchTriggered(true);

      if (productsContainerRef.current) {
        productsContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  },
  [selectedCategory, searchTerm] // ✅ include deps
);

const handleSearchKeyPress = (e) => {
  if (e.key === "Enter") {
    fetchProducts(true);
  }
};

  // ---------------------------
  // Debounced search
  // ---------------------------
  // const debouncedSearch = useCallback(debounce(() => fetchProducts(true), 500), [fetchProducts]);
  // useEffect(() => {
  //   if (searchTerm) debouncedSearch();
  // }, [searchTerm, selectedCategory, debouncedSearch]);

  // ---------------------------
  // Category navigation
  // ---------------------------
  // const handleCategoryClick = (category) => {
  //   setSelectedCategory(category);
  //   setSearchTerm("");
  //   setPage(1);
  //   setProducts([]);
  //   setPages(1);
  //   setSearchTriggered(false);
  //   sessionStorage.setItem(
  //     STORAGE_KEY,
  //     JSON.stringify({
  //       selectedCategory: category,
  //       searchTerm: "",
  //       products: [],
  //       page: 1,
  //       pages: 1,
  //       searchTriggered: false,
  //       scrollY: 0,
  //     })
  //   );
  // };

  // ---------------------------
  // Modal functions
  // ---------------------------
  function openModal(product) {
    setModalProduct(product);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setModalProduct(null);
    document.body.style.overflow = "auto";
  }

  // ---------------------------
  // Render JSX
  // ---------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search + Category */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/4 border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#E3C396] transition"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "Gente Kadi" ? "Gents Kadi" : cat}
            </option>
          ))}
        </select>

        <input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={handleSearchKeyPress}   // ✅ Added
  placeholder="Search for treasures..."
  className="w-full md:flex-1 border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#E3C396] transition"
/>


        <button
          onClick={() => fetchProducts(true)}
          className="bg-gradient-to-r from-[#B76E79] to-[#E3C396] text-white px-6 py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition"
        >
          Search
        </button>
      </div>

      <OfferBanner />

      {/* Categories Section */}
      <section id="categories" className="mb-8">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
          Explore Categories
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {categories.filter((cat) => cat !== "All").map((cat) => (
            <Link
              href={`/category/${encodeURIComponent(cat)}`}
              key={cat}
              className="m-2 border border-red-600 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={optimizeCloudinaryUrl(categoryImages[cat], 200, 200)}
                alt={cat}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <span className="text-white font-semibold text-sm sm:text-base px-2 text-center">
                  {cat === "Gente Kadi" ? "Gents Kadi" : cat}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewArrivals />

      {/* Products Grid */}
      <section className="bg-gradient-to-r from-[#e2b7bd] to-[#dac6aa] rounded-2xl p-3 shadow-xl border border-red-300 mt-10">
  {/* Heading */}
  
  {
    products.length == 0 ? 
    <div className="col-span-full flex justify-evenly gap-4">
        <div className="p-2 flex flex-col items-center">
          <img src="/images/htu1.webp" alt="How to use" loading="lazy"
            className="rounded-lg shadow-md hover:scale-105 transition w-full max-w-[200px] object-cover"/>
        </div>

        <div className="p-2 flex flex-col items-center">
          <img src="/images/htu2.webp" alt="How to use" loading="lazy"
            className="rounded-lg shadow-md hover:scale-105 transition w-full max-w-[200px] object-cover"/>
        </div>
      </div> : 
      <h2 className="text-3xl font-bold text-center text-yellow-700 mb-8">
    Searched Products
  </h2>
  }
  

  {/* Products Grid */}
  <div ref={productsContainerRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {loading ? (
      <div className="col-span-full flex justify-center py-6">
        <div className="w-12 h-12 border-4 border-[#E3C396] border-dashed rounded-full animate-spin"></div>
      </div>
    ) : searchTriggered && products.length === 0 ? (
      <p className="text-center text-gray-600 col-span-full">No treasures found.</p>
    ) : (
      products.map((product) => (
        <button
          key={product._id}
          onClick={() => openModal(product)}
          className="group product-card flex flex-col overflow-hidden rounded-2xl shadow-md border border-[#f5e6d3] bg-gradient-to-br from-[#fffdf9] via-[#fff8f2] to-[#fff3ea] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          {/* Product card content */}
          <div className="relative overflow-hidden w-full aspect-square">
            <img
              src={optimizeCloudinaryUrl(product.imageUrl, 400, 400)}
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-lg"
            />
            <span
              className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full shadow ${
                product.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
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
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            )}
            <div className="footer border-t border-gray-200 pt-3 mt-2 text-sm space-y-1">
              <div className="text-gray-500 line-through">MRP : ₹{product.mrp || "---"}</div>
              <div className="text-gray-800 font-medium">
                Price : ₹{product.price || "---"}{" "}
                <span className="text-green-600 font-semibold">
                  ({product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0}% OFF)
                </span>
              </div>
              <div className="text-yellow-600 font-medium">Extra 10% OFF applied</div>
              <div className="text-green-700 font-bold">
                Final Price : ₹{product.price ? Math.round(product.price * 0.9) : "---"}
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
      ))
    )}
  </div>
</section>


      {/* Pagination */}
      {searchTriggered && products.length > 0 && (
        <div className="flex flex-wrap justify-center mt-8 gap-3">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchProducts(false, i + 1)}
              className={`px-4 py-2 rounded-full ${page === i + 1 ? "bg-yellow-500 text-white shadow-lg" : "bg-pink-100 text-gray-700 hover:bg-yellow-200"} transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Scroll to Top Button */}
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

      {/* Global Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-14 h-14 border-4 border-t-transparent border-[#E3C396] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Product Modal */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-auto"
          onClick={closeModal}
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">{modalProduct.title}</h2>
              {modalProduct.description && <p className="text-gray-700 mb-2 text-sm sm:text-base line-clamp-4">{modalProduct.description}</p>}
              <p className="line-through text-gray-500 text-sm sm:text-base">MRP: ₹{modalProduct.mrp || "---"}</p>
              <p className="text-gray-800 font-semibold text-sm sm:text-base">
                Price: ₹{modalProduct.price || "---"} (
                {modalProduct.mrp && modalProduct.price
                  ? Math.round(((modalProduct.mrp - modalProduct.price) / modalProduct.mrp) * 100)
                  : 0}
                % OFF)
              </p>
              <p className="text-yellow-600 font-medium text-sm sm:text-base mb-2">Extra 10% OFF applied</p>
              <p className="text-green-700 font-bold text-base sm:text-lg mb-4">Final Price: ₹{modalProduct.price ? Math.round(modalProduct.price * 0.9) : "---"}</p>
              {modalProduct.inStock ? (
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_SHOP_WHATSAPP}?text=${encodeURIComponent(
                    `Hello! I'm interested in this product: ${modalProduct.title}. Link : ${window.location.origin}/product/${modalProduct._id}`
                  )}`}
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center font-semibold transition transform hover:scale-105"
                >
                  Buy on WhatsApp
                </a>
              ) : (
                <span className="inline-block px-3 py-2 bg-red-100 text-red-600 rounded text-sm sm:text-base">Out of Stock</span>
              )}
              <button
                onClick={closeModal}
                className="absolute top-3 right-5 sm:top-4 sm:right-4 text-red-500 hover:text-red-300 text-4xl sm:text-3xl font-bold"
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




// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Footer from "@/components/Footer";
// import Link from "next/link";
// import debounce from "lodash/debounce"; // Install lodash for debouncing
// import OfferBanner from "./OfferBanner";
// import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
// import NewArrivals from "./NewArrivals";

// export default function ShopHome() {
//   const router = useRouter();
//   const [categories, setCategories] = useState([]);
//   const [categoryImages, setCategoryImages] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [searchTriggered, setSearchTriggered] = useState(false);
//   const [modalProduct, setModalProduct] = useState(null);
//   const [showScroll, setShowScroll] = useState(false);

//   const productsContainerRef = useRef(null);

//   const limit = 16;
//   const STORAGE_KEY = "shopState";

//   // Debounced function to save scroll position
//   const saveScrollPosition = useCallback(
//     debounce(() => {
//       const state = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
//       sessionStorage.setItem(
//         STORAGE_KEY,
//         JSON.stringify({ ...state, scrollY: window.scrollY })
//       );
//     }, 100),
//     []
//   );


//   // Scroll event listener
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScroll(window.scrollY > 300);
//       saveScrollPosition();
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       saveScrollPosition.cancel(); // Cancel debounce on cleanup
//     };
//   }, [saveScrollPosition]);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Load saved state from sessionStorage
//   useEffect(() => {
//     const savedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
//     if (savedState) {
//       setSelectedCategory(savedState.selectedCategory || "All");
//       setSearchTerm(savedState.searchTerm || "");
//       setProducts(savedState.products || []);
//       setPage(savedState.page || 1);
//       setPages(savedState.pages || 1);
//       setSearchTriggered(savedState.searchTriggered || false);
//       // Restore scroll after DOM is ready
//       const restoreScroll = () => {
//         if (savedState.scrollY) {
//           window.scrollTo(0, savedState.scrollY);
//         }
//       };
//       requestAnimationFrame(restoreScroll);
//     }
//   }, []);

//   // Fetch categories
//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/categories");
//         const data = await res.json();
//         setCategories(["All", ...data.categories]);
//         setCategoryImages(data.categoryImages);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCategories();
//   }, []);

//   // Save state to sessionStorage with debounce
//   const saveState = useCallback(
//     debounce(() => {
//       const state = {
//         selectedCategory,
//         searchTerm,
//         products,
//         page,
//         pages,
//         searchTriggered,
//         scrollY: window.scrollY,
//       };
//       sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//     }, 100),
//     [selectedCategory, searchTerm, products, page, pages, searchTriggered]
//   );

//   useEffect(() => {
//     saveState();
//     return () => saveState.cancel(); // Cancel debounce on cleanup
//   }, [selectedCategory, searchTerm, products, page, pages, searchTriggered, saveState]);

//   // Fetch products
//   const fetchProducts = useCallback(
//     async (resetPage = true, targetPage = 1) => {
//       const currentPage = resetPage ? 1 : targetPage;
//       setPage(currentPage);
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `/api/products?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`
//         );
//         const data = await res.json();
//         setProducts(data.products);
//         setPages(data.pages);
//         setSearchTriggered(true);

//         if (productsContainerRef.current) {
//           productsContainerRef.current.scrollIntoView({ behavior: "smooth" });
//         }

//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [selectedCategory, searchTerm]
//   );

//   // Handle navigation to category pages
//   const handleCategoryClick = (category) => {
//     // Reset state when navigating to a category page
//     setSelectedCategory(category);
//     setSearchTerm("");
//     setPage(1);
//     setProducts([]);
//     setPages(1);
//     setSearchTriggered(false);
//     sessionStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify({
//         selectedCategory: category,
//         searchTerm: "",
//         products: [],
//         page: 1,
//         pages: 1,
//         searchTriggered: false,
//         scrollY: 0,
//       })
//     );
//   };

//   function openModal(product) {
//     setModalProduct(product);
//     document.body.style.overflow = "hidden";
//   }

//   function closeModal() {
//     setModalProduct(null);
//     document.body.style.overflow = "auto";
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">


//       {/* Search + Category */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full md:w-1/4 border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#E3C396] transition"
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {
//                 (cat == "Gente Kadi" ? "Gents Kadi" : cat)
//               }
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search for treasures..."
//           className="w-full md:flex-1 border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#E3C396] transition"
//         />

//         <button
//           onClick={() => fetchProducts(true)}
//           className="bg-gradient-to-r from-[#B76E79] to-[#E3C396] text-white px-6 py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition"
//         >
//           Search
//         </button>
//       </div>

//       <OfferBanner />
      
//       {/* Categories Section */}
//       <section id="categories" className="mb-8">
//         <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
//           Explore Categories
//         </h2>
//         <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3">
//           {categories
//             .filter((cat) => cat !== "All")
//             .map((cat) => (
//               <Link
//                 href={`/category/${encodeURIComponent(cat)}`}
//                 key={cat}
//                 // onClick={() => handleCategoryClick(cat)}
//                 className="m-2 border border-red-600 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
//               >
//                 <img
//                   src={optimizeCloudinaryUrl(categoryImages[cat], 200, 200)}
//                   alt={cat}
//                   className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
//                 />

//                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
//                   <span className="text-white font-semibold text-sm sm:text-base px-2 text-center">
//                     {
//                       (cat == "Gente Kadi" ? "Gents Kadi" : cat)
//                     }
//                   </span>
//                 </div>
//               </Link>
//             ))}
//         </div>
//       </section>

//       <NewArrivals/>

//       {/* Products Grid */}
//       <section ref={productsContainerRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {loading ? (
//           <div className="col-span-full flex justify-center py-6">
//             <div className="w-12 h-12 border-4 border-[#E3C396] border-dashed rounded-full animate-spin"></div>
//           </div>
//         ) : searchTriggered && products.length === 0 ? (
//           <p className="text-center text-gray-600 col-span-full">No treasures found.</p>
//         ) : (
//           products.map((product) => (
//             <button
//               key={product._id}
//               onClick={() => openModal(product)}
//               className="group product-card flex flex-col overflow-hidden rounded-2xl shadow-md border border-[#f5e6d3] bg-gradient-to-br from-[#fffdf9] via-[#fff8f2] to-[#fff3ea] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//             >
//               <div className="relative overflow-hidden w-full aspect-square">
//                 <img
//                   src={optimizeCloudinaryUrl(product.imageUrl, 400, 400)}
//                   alt={product.title}
//                   loading="lazy"
//                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-lg"
//                 />

//                 <span
//                   className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full shadow ${product.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
//                     }`}
//                 >
//                   {product.inStock ? "Available" : "Out of Stock"}
//                 </span>
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
//               </div>

//               <div className="p-4 flex flex-col flex-1 font-sans">
//                 <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1 mb-1">
//                   {product.title}
//                 </h3>
//                 {product.description && (
//                   <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
//                 )}
//                 <div className="footer border-t border-gray-200 pt-3 mt-2 text-sm space-y-1">
//                   <div className="text-gray-500 line-through">MRP : ₹{product.mrp || "---"}</div>
//                   <div className="text-gray-800 font-medium">
//                     Price : ₹{product.price || "---"}{" "}
//                     <span className="text-green-600 font-semibold">
//                       (
//                       {product.mrp && product.price
//                         ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
//                         : 0}
//                       % OFF)
//                     </span>
//                   </div>
//                   <div className="text-yellow-600 font-medium">Extra 10% OFF applied</div>
//                   <div className="text-green-700 font-bold">
//                     Final Price : ₹
//                     {product.price ? Math.round(product.price - product.price * 0.1) : "---"}
//                   </div>
//                   <div
//                     className="mt-3 bg-[#B76E79] text-white px-4 py-1.5 rounded-md shadow hover:opacity-90 transition text-center cursor-pointer"
//                     onClick={() => openModal(product)}
//                   >
//                     View
//                   </div>
//                 </div>
//               </div>
//             </button>
//           ))
//         )}
//       </section>

//       {/* Pagination */}
//       {searchTriggered && products.length > 0 && (
//         <div className="flex flex-wrap justify-center mt-8 gap-3">
//           {Array.from({ length: pages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => fetchProducts(false, i + 1)}
//               className={`px-4 py-2 rounded-full ${page === i + 1
//                 ? "bg-yellow-500 text-white shadow-lg"
//                 : "bg-pink-100 text-gray-700 hover:bg-yellow-200"
//                 } transition`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Scroll to Top Button */}
//       {!modalProduct && showScroll && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 bg-gradient-to-r from-[#B76E79] to-[#E3C396] p-3 rounded-full shadow-lg hover:scale-110 transition duration-300 z-50"
//           aria-label="Scroll to top"
//         >
//           <svg
//             className="w-5 h-5 text-white"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
//           </svg>
//         </button>
//       )}

//       {/* Global Loader Overlay */}
//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="w-14 h-14 border-4 border-t-transparent border-[#E3C396] rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Product Modal */}
//       {modalProduct && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-auto"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white/80 w-full max-w-3xl rounded-xl shadow-xl p-4 sm:p-6 md:p-6 relative flex flex-col md:flex-row gap-4 md:gap-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={modalProduct.imageUrl}
//               alt={modalProduct.title}
//               className="w-full md:w-1/2 h-auto object-cover rounded-lg flex-shrink-0"
//             />

//             <div className="flex-1 flex flex-col">
//               <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">
//                 {modalProduct.title}
//               </h2>
//               {modalProduct.description && (
//                 <p className="text-gray-700 mb-2 text-sm sm:text-base line-clamp-4">
//                   {modalProduct.description}
//                 </p>
//               )}
//               <p className="line-through text-gray-500 text-sm sm:text-base">
//                 MRP: ₹{modalProduct.mrp || "---"}
//               </p>
//               <p className="text-gray-800 font-semibold text-sm sm:text-base">
//                 Price: ₹{modalProduct.price || "---"} (
//                 {modalProduct.mrp && modalProduct.price
//                   ? Math.round(((modalProduct.mrp - modalProduct.price) / modalProduct.mrp) * 100)
//                   : 0}
//                 % OFF)
//               </p>
//               <p className="text-yellow-600 font-medium text-sm sm:text-base mb-2">
//                 Extra 10% OFF applied
//               </p>
//               <p className="text-green-700 font-bold text-base sm:text-lg mb-4">
//                 Final Price: ₹{modalProduct.price ? Math.round(modalProduct.price * 0.9) : "---"}
//               </p>
//               {modalProduct.inStock ? (
//                 <a
//                   href={`https://wa.me/${process.env.NEXT_PUBLIC_SHOP_WHATSAPP}?text=${encodeURIComponent(
//                     `Hello! I'm interested in this product: ${modalProduct.title}. Link : ${window.location.origin}/product/${modalProduct._id}`
//                   )}`}
//                   target="_blank"
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center font-semibold transition transform hover:scale-105"
//                 >
//                   Buy on WhatsApp
//                 </a>
//               ) : (
//                 <span className="inline-block px-3 py-2 bg-red-100 text-red-600 rounded text-sm sm:text-base">
//                   Out of Stock
//                 </span>
//               )}
//               <button
//                 onClick={closeModal}
//                 className="absolute top-3 right-5 sm:top-4 sm:right-4 text-red-500 hover:text-red-300 text-4xl sm:text-3xl font-bold"
//               >
//                 &times;
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }