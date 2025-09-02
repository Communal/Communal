import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  reference: { type: String, required: true, unique: true, index: true },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  type: { type: String, enum: ["CREDIT", "DEBIT"], required: true, index: true },
  status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS", index: true },
  description: { type: String, enum: ["Wallet in", "Withdrawal"], required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Compound index to speed common queries
TransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);