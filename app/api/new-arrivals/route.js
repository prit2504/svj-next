import dbConnect from "../../../lib/db";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();

  // get enum categories directly from schema
  const categories = Product.schema.path("category").enumValues;

  const data = {};
  for (const cat of categories) {
    // fetch latest 16 products in this category
    const latest = await Product.find({ category: cat })
      .sort({ createdAt: -1 })
      .limit(16);

    // shuffle and pick 4 random ones
    const shuffled = latest.sort(() => 0.5 - Math.random());
    data[cat] = shuffled.slice(0, 4);
  }

  return Response.json({ arrivals: data });
}

// /api/new-arrivals/route.js
// import dbConnect from "../../../lib/db";
// import Product from "@/models/Product";

// export async function GET() {
//   await dbConnect();

//   // aggregate products by category (latest 4 each)
//   const pipeline = [
//     { $sort: { createdAt: -1 } }, // sort once globally
//     {
//       $group: {
//         _id: "$category",
//         products: { $push: "$$ROOT" },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         category: "$_id",
//         products: { $slice: ["$products", 4] }, // take first 4 per category
//       },
//     },
//   ];

//   const arrivals = await Product.aggregate(pipeline);

//   return Response.json({ arrivals });
// }
