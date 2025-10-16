// app/api/payments/squad/in/route.js
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Crypto from "node:crypto";

// Simple USD→NGN conversion helper (using free API)
async function getUsdToNgnRate() {
  try {
    const res = await fetch(
      "https://api.exchangerate.host/convert?from=USD&to=NGN"
    );
    const data = await res.json();
    if (!data?.info?.rate) throw new Error("No rate found");
    return data.info.rate; // Example: 1605.22
  } catch (err) {
    console.error("Rate fetch error:", err);
    // fallback rate if API fails
    return 1600;
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      userId,
      usdAmount,
      email,
      customer_name,
      description = "Wallet in",
    } = body;

    if (!userId || !usdAmount || !email || !customer_name) {
      return NextResponse.json(
        { status: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const usdValue = Number(usdAmount);
    if (Number.isNaN(usdValue) || usdValue <= 0) {
      return NextResponse.json(
        { status: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // const rate = await getUsdToNgnRate();
    const rate = 1600;
    const amountNgn = usdValue * rate;

    // Generate idempotent reference
    const transaction_ref = `SQ_${Date.now()}_${Crypto.randomBytes(6).toString(
      "hex"
    )}`;

    // Save transaction as PENDING (store both USD + NGN + rate)
    const tx = await Transaction.create({
      userId: new mongoose.Types.ObjectId(userId),
      reference: transaction_ref,
      amount: mongoose.Types.Decimal128.fromString(amountNgn.toFixed(2)),
      usdAmount: mongoose.Types.Decimal128.fromString(usdValue.toFixed(2)),
      rate,
      type: "CREDIT",
      status: "PENDING",
      description: `Wallet in`,
    });

    // Squad expects amount in kobo (integer)
    const amount_kobo = Math.round(amountNgn * 100);

    return NextResponse.json({
      status: true,
      message: "Transaction created",
      data: {
        transaction_ref,
        amount_kobo,
        publicKey: process.env.NEXT_PUBLIC_SQUAD_PUB_KEY,
        email,
        customer_name,
        rate,
        usdValue,
        amountNgn,
      },
    });
  } catch (err) {
    console.error("Create transaction error:", err);
    return NextResponse.json(
      { status: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
