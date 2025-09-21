// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Gents Chain",
        "Gents Bracelets",
        "Gents Kada",
        "Rudraksh Mala/Bracelets",
        "Gente Kadi",
        "Ladies Chain",
        "Ladies Bracelets",
        "Ladies Kada",
        "Golden Dokiya",
        "Mangalsutra with Earings",
        "Dokiya Mangalsutra",
        "Long Mangalsutra",
        "Half Set",
        "Long Set ( Rani Har )",
        "Bangles",
        "Chudi Bangles",
        "Fancy Mala",
      ],
    },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
