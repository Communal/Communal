import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicit _id
  name: { type: String, required: true },
  price: { type: Number, required: true },
  info: { type: String, maxlength: 500 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  data: { type: String },
  isSold: { type: Boolean, default: false },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
