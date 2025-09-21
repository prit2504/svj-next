import Product from "@/models/Product"; // adjust path to your Mongoose model
import dbConnect from "../../../../lib/db";

export async function GET(req, { params }) {
  try {
    await dbConnect(); // connect to DB
    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ product }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch product" }), { status: 500 });
  }
}
