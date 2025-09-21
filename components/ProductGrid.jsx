"use client";
import { useShop } from "../context/ShopContex";
import Link from "next/link";

export default function ProductGrid() {
  const { products } = useShop();

  if (!products.length) {
    return <p className="text-center py-6 text-gray-600">No treasures found.</p>;
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map(product => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className="group product-card border rounded-lg shadow hover:-translate-y-1 transition"
        >
          <div className="relative aspect-square">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="object-cover w-full h-full group-hover:scale-105 transition"
            />
            {!product.inStock && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <p className="font-bold text-[#B76E79] mt-2">₹{product.price}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
