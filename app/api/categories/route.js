import Product from "@/models/Product"; // adjust path to your Mongoose model
import dbConnect from "../../../lib/db"; // if you have a db connection helper

export async function GET(req) {
  try {
    // connect to DB
    await dbConnect();

    // Get category enum values from Product schema
    const categories = Product.schema.path("category").enumValues;

    // Map categories to image paths
    const categoryImages = {
      "Gents Chain": "/assets/categories/gents_chain.jpg",
      "Gents Bracelets": "/assets/categories/gents_bracelet.jpg",
      "Gents Kada": "/assets/categories/gents_kada.jpg",
      "Rudraksh Mala/Bracelets": "/assets/categories/rudraksh_mala.jpg",
      "Gente Kadi": "/assets/categories/gents_kadi.jpg",
      "Ladies Chain": "/assets/categories/ladies_chain.jpg",
      "Ladies Bracelets": "/assets/categories/ladies_bracelates.jpg",
      "Ladies Kada": "/assets/categories/ladies_kada.jpg",
      "Golden Dokiya": "/assets/categories/dokiya.jpg",
      "Mangalsutra with Earings": "/assets/categories/pandant.jpg",
      "Dokiya Mangalsutra": "/assets/categories/dokiya_mangalsutra.jpg",
      "Long Mangalsutra": "/assets/categories/long_mangalsutra.jpg",
      "Half Set": "/assets/categories/half_nacklaceset.jpg",
      "Long Set ( Rani Har )": "/assets/categories/rani_haar_neckeless.jpg",
      "Bangles": "/assets/categories/bangles.jpg",
      "Chudi Bangles": "/assets/categories/chudi_bangles.jpg",
      "Fancy Mala": "/assets/categories/fancy_mala.jpg",
    };

    return new Response(
      JSON.stringify({ categories, categoryImages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
