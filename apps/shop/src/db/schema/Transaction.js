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
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"], // Needed for failed transactions
      default: "SUCCESS",
    },
    description: {
      type: String,
      enum: ["Wallet in", "Withdrawal"], // Could be expanded
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
