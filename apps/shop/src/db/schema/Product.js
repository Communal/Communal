import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  info: { type: String, maxlength: 500 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  data: { type: String },
  isSold: { type: Boolean, default: false, index: true },
}, { timestamps: false });

// Compound index for improved filtering
ProductSchema.index({ category: 1, price: 1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);