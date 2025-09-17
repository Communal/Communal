import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const { transaction_ref } = await req.json();

    if (!transaction_ref) {
      return NextResponse.json({ error: "Transaction reference is required" }, { status: 400 });
    }

    // Verify transaction with Squad API
    const response = await fetch(
      `https://sandbox-api-d.squadco.com/transaction/verify/${transaction_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Verification failed" }, { status: 400 });
    }

    const { success, transaction_ref: ref, amount, customer } = data;

    let tx = await Transaction.findOne({ reference: transaction_ref });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found in DB" }, { status: 404 });
    }

    // If already updated, return early (idempotent)
    if (tx.status === "SUCCESS") {
      return NextResponse.json({ message: "Already verified", tx });
    }

    // If transaction was successful, update DB
    if (success === true) {
      tx.status = "SUCCESS";
      await tx.save();

      // Update user balance (only once)
      await User.findByIdAndUpdate(tx.userId, {
        $inc: { balance: tx.amount },
      });

      return NextResponse.json({ message: "Verification successful, balance updated", tx });
    } else {
      tx.status = "FAILED";
      await tx.save();
      return NextResponse.json({ message: "Transaction failed", tx });
    }
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}