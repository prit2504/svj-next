"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
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
    return <p className="text-center py-10 text-gray-700">Product not found.</p>;
  }

  const baseDiscount =
    product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const extraDiscountedPrice = product.price ? Math.round(product.price - product.price * 0.1) : null;

  // const shopNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP;
  // const message = encodeURIComponent(
  //   `Hello! I'm interested in this product:\n\n${product.title}\n\nLink: ${window.location.href}`
  // );
  // const whatsappLink = `https://wa.me/message/YYDUQB5Y2PCTC1?text=${message}`;

  return (
    <div className="bg-gray-50 min-h-screen">


      {/* Breadcrumb */}
      {/* <div className="max-w-7xl mx-auto px-4 py-4 text-gray-600 text-sm flex flex-wrap gap-2 items-center">
        <a href="/" className="hover:underline">
          Home
        </a>
        <span>&gt;</span>
        <span>{product.category}</span>
        <span>&gt;</span>
        <span className="font-semibold text-gray-800">{product.title}</span>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
      </div> */}

      {/* Product Detail */}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-2 line-through">MRP : ₹{product.mrp || "---"}</p>
          <p className="text-gray-800 font-semibold mb-2">
            Price : ₹{product.price || "---"} <span className="text-green-600">({baseDiscount}% OFF)</span>
          </p>
          <p className="text-yellow-600 font-medium mb-2">Extra 10% OFF applied</p>
          <p className="text-green-700 font-bold text-lg mb-4">Final Price : ₹{extraDiscountedPrice || "---"}</p>
          {product.description && <p className="text-gray-700 mb-4">{product.description}</p>}
          {product.inStock ? (
            <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded mb-4">In Stock</span>
          ) : (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded mb-4">Out of Stock</span>
          )}
          {/* {product.inStock && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-center transition transform hover:scale-105"
            >
              Buy on WhatsApp
            </a>
          )} */}
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}
