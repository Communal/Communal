// lib/transactionLogger.js
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";

export async function logTransaction({
  userId,
  amount,
  currency,
  type,
  description,
  reference,
  status,
  gatewayResponse,
}) {
  await connectDB();
  try {
    const txn = await Transaction.create({
      userId,
      amount,
      currency,
      type,
      description,
      reference,
      status,
      gatewayResponse,
    });
    return txn;
  } catch (err) {
    console.error("Transaction logging failed:", err);
  }
}
