// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: mongoose.Decimal128, required: true },
    currency: { type: String, default: "NGN" },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    description: {
      type: String,
      enum: ["Wallet in", "Withdrawal"],
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    gatewayResponse: { type: Object }, // stores Korapay raw webhook response
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
