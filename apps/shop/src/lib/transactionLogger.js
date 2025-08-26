// lib/transactionLogger.js
import Transaction from "@/db/schema/Transaction";
import connectDB from "@/config/db";

export async function logTransaction({
  userId,
  reference,
  amount,
  type,
  status,
  description,
}) {
  try {
    await connectDB();

    const txn = new Transaction({
      userId,
      reference,
      amount,
      type,
      status,
      description,
    });

    await txn.save();
    return txn;
  } catch (err) {
    console.error("Transaction logging failed:", err);
    throw err;
  }
}
