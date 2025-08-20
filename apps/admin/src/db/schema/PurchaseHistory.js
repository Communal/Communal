// models/PurchaseHistory.js
import mongoose from "mongoose";
import Product from "./Product";

const PurchaseHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only createdAt
  }
);

export default mongoose.models.PurchaseHistory ||
  mongoose.model("PurchaseHistory", PurchaseHistorySchema);
