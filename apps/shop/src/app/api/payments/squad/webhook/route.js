import connectDB from "@/config/db";
import User from "@/db/schema/User";
import Transaction from "@/db/schema/Transaction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { headers } from "next/headers";
import Crypto from "node:crypto";

export async function POST(req) {
  await connectDB();

  try {
    const reqHash = (await headers()).get("x-squad-encrypted-body");
    const body = await req.json();
    const { Event, Body } = body;

    if (Event === "charge_successful") {
      const bodyHash = Crypto.createHmac("sha512", process.env.SQUAD_SECRET_KEY)
        .update(JSON.stringify(body))
        .digest("hex")
        .toUpperCase();

      if (reqHash !== bodyHash) {
        throw new Error("Invalid call");
      }

      // Find transaction
      const transaction = await Transaction.findOne({
        reference: Body.transaction_ref,
      });

      if (!transaction) {
        return NextResponse.json(
          { status: false, message: "Transaction not found" },
          { status: 404 }
        );
      }

      // Update transaction status
      transaction.status = Body.transaction_status.toUpperCase();
      await transaction.save();

      // If successful, credit user balance
      if (Body.transaction_status.toLowerCase() === "success") {
        const user = await User.findOne({ email: Body.email });
        if (user) {
          const currentBalance = Number(user.balance) ?? 0;
          const newBalance = currentBalance + Number(Body.amount) / 100;

          user.balance = mongoose.Types.Decimal128.fromString(
            newBalance.toString()
          );
          await user.save();
        }
      }

      return NextResponse.json({ status: true, message: "Success" });
    }

    return NextResponse.json({ status: false, message: "Unhandled event" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json(
      { status: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}