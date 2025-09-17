// /api/transaction/initiate.js
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();

  try {
    const { userId, amount, email } = await req.json();

    const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const transaction = new Transaction({
      userId,
      reference: transactionRef,
      amount: mongoose.Types.Decimal128.fromString((amount / 100).toString()),
      type: "CREDIT",
      status: "PENDING",
      description: "Wallet in",
    });

    await transaction.save();

    return NextResponse.json({
      status: true,
      transaction_ref: transactionRef,
      email,
      amount,
    });
  } catch (err) {
    console.error("Initiation Error:", err);
    return NextResponse.json(
      { status: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
