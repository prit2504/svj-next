import dbConnect from "@/lib/db";
import Product from "../../../models/Product";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  // const rawCategory = searchParams.get("category") || "All";
  // const category = decodeURIComponent(rawCategory);
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 16;

  const filter = {};
  if (category && category !== "All") filter.category = category;
  // if (search) filter.$text = { $search: search };
  if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

  const skip = (page - 1) * limit;
  const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(filter);

  return Response.json({
    products,
    page,
    pages: Math.ceil(total / limit)
  });
}
