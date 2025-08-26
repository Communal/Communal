// app/api/webhook/korapay/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";

export async function POST(req) {
  await connectDB();
  try {
    const payload = await req.json();

    const { reference, status } = payload.data || {};
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // Map Korapay status to our schema
    let txnStatus = "PENDING";
    if (status?.toLowerCase() === "success") txnStatus = "SUCCESS";
    if (status?.toLowerCase() === "failed") txnStatus = "FAILED";

    // Update transaction in DB
    const txn = await Transaction.findOneAndUpdate(
      { reference },
      { status: txnStatus, gatewayResponse: payload },
      { new: true }
    );

    if (!txn) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Webhook processed", txn }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
