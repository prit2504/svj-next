// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Footer from "@/components/Footer";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         const res = await fetch(`/api/products/${id}`);
//         if (!res.ok) throw new Error("Product not found");
//         const data = await res.json();
//         setProduct(data.product);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProduct();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <div className="w-12 h-12 border-4 border-yellow-600 border-dashed rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!product) {
//     return <p className="text-center py-10 text-gray-700">Product not found.</p>;
//   }

//   const baseDiscount =
//     product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
//   const extraDiscountedPrice = product.price ? Math.round(product.price - product.price * 0.1) : null;

//   // const shopNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP;
//   // const message = encodeURIComponent(
//   //   `Hello! I'm interested in this product:\n\n${product.title}\n\nLink: ${window.location.href}`
//   // );
//   // const whatsappLink = `https://wa.me/message/YYDUQB5Y2PCTC1?text=${message}`;

//   return (
//     <div className="bg-gray-50 min-h-screen">


//       {/* Breadcrumb */}
//       {/* <div className="max-w-7xl mx-auto px-4 py-4 text-gray-600 text-sm flex flex-wrap gap-2 items-center">
//         <a href="/" className="hover:underline">
//           Home
//         </a>
//         <span>&gt;</span>
//         <span>{product.category}</span>
//         <span>&gt;</span>
//         <span className="font-semibold text-gray-800">{product.title}</span>
//         <button
//           type="button"
//           onClick={() => window.history.back()}
//           className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
//         >
//           ← Back
//         </button>
//       </div> */}

//       {/* Product Detail */}
//       <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
//         {/* Image */}
//         <div className="flex-1 flex justify-center items-center">
//           {!imageLoaded && (
//             <div className="w-12 h-12 border-4 border-yellow-600 border-dashed rounded-full animate-spin"></div>
//           )}
//           <img
//             src={product.imageUrl}
//             alt={product.title}
//             className={`w-full max-w-md rounded-xl shadow-lg object-cover transition-opacity duration-500 ${
//               imageLoaded ? "opacity-100" : "opacity-0"
//             }`}
//             onLoad={() => setImageLoaded(true)}
//           />
//         </div>

//         {/* Details */}
//         <div className="flex-1 flex flex-col justify-start">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
//           <p className="text-gray-600 mb-2 line-through">MRP : ₹{product.mrp || "---"}</p>
//           <p className="text-green-700 font-bold mb-2 sm:text-xl">
//             Price : ₹{product.price || "---"} <span className="text-green-600">({baseDiscount}% OFF)</span>
//           </p>
//           {/* <p className="text-yellow-600 font-medium mb-2">Extra 10% OFF applied</p>
//           <p className="text-green-700 font-bold text-lg mb-4">Final Price : ₹{extraDiscountedPrice || "---"}</p> */}
//           {product.description && <p className="text-gray-700 mb-4">{product.description}</p>}
//           {product.inStock ? (
//             <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded mb-4">In Stock</span>
//           ) : (
//             <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded mb-4">Out of Stock</span>
//           )}
//           {/* {product.inStock && (
//             <a
//               href={whatsappLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-center transition transform hover:scale-105"
//             >
//               Buy on WhatsApp
//             </a>
//           )} */}
//         </div>
//       </section>

//       {/* <Footer /> */}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Share2, MessageCircle } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "force-cache" });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-yellow-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-700">
        Product not found.
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const baseDiscount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this product: ${product?.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  // ✅ WhatsApp Buy Button Link
  const whatsappNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP;
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in this product:\n\n${product.title}\n\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* ✅ Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-gray-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-500">
          Category: {product.category || "—"}
        </span>
      </div>

      {/* ✅ Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center">
          {!imageLoaded && (
            <div className="w-12 h-12 border-4 border-yellow-600 border-dashed rounded-full animate-spin"></div>
          )}
          <img
            src={product.imageUrl}
            alt={product.title}
            className={`w-full max-w-md rounded-xl shadow-lg object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-start">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.title}
          </h1>

          <div className="mb-4">
            <p className="text-gray-600 line-through">
              MRP : ₹{product.mrp || "---"}
            </p>
            <p className="text-green-700 font-bold text-xl">
              Price : ₹{product.price || "---"}{" "}
              <span className="text-green-600 text-base">({baseDiscount}% OFF)</span>
            </p>
          </div>

          {product.description && (
            <p className="text-gray-700 mb-5 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* ✅ Delivery Info Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              🚚 Delivery Information
            </h2>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• For <strong>Prepaid Orders</strong> – <span className="text-green-600 font-semibold">Free Delivery</span></li>
              <li>• For <strong>COD Orders (within Gujarat)</strong> – ₹100</li>
              <li>• For <strong>COD Orders (outside Gujarat)</strong> – ₹150</li>
            </ul>
          </div>

          {/* ✅ Buy on WhatsApp Button */}
          {product.inStock ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-center transition transform hover:scale-105 w-full md:w-auto"
            >
              <MessageCircle size={20} /> Buy on WhatsApp
            </a>
          ) : (
            <span className="inline-block px-3 py-2 bg-red-100 text-red-600 rounded mb-4 font-semibold text-center">
              Out of Stock
            </span>
          )}

          {/* ✅ Share Buttons */}
          <div className="mt-6">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              <Share2 size={18} /> Share Product
            </button>

            <div className="flex flex-wrap gap-3 mt-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${product.title} - ${typeof window !== "undefined" ? window.location.href : ""}`
                )}`}
                target="_blank"
                className="text-green-600 underline"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                Facebook
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}&text=${encodeURIComponent(product.title)}`}
                target="_blank"
                className="text-sky-600 underline"
              >
                Telegram
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}&text=${encodeURIComponent(product.title)}`}
                target="_blank"
                className="text-blue-400 underline"
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
