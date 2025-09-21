import dbConnect from "../../../../lib/db";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { category } = params;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 16;

    const filter = {};
    if (category && category !== "All") filter.category = category;

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return new Response(
      JSON.stringify({
        products,
        category,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error loading category products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
