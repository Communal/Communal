// app/api/payments/squad/in/route.js
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Crypto from "node:crypto";

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const { userId, amount, email, customer_name, description = "Wallet in" } = body;

        if (!userId || !amount || !email || !customer_name) {
            return NextResponse.json(
                { status: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // normalize amount as number in NGN (e.g. 500 -> $500)
        const amountNumber = Number(amount);
        if (Number.isNaN(amountNumber) || amountNumber <= 0) {
            return NextResponse.json({ status: false, message: "Invalid amount" }, { status: 400 });
        }

        // Generate idempotent reference
        const transaction_ref = `SQ_${Date.now()}_${Crypto.randomBytes(6).toString("hex")}`;

        // Save transaction as PENDING
        const tx = await Transaction.create({
            userId: new mongoose.Types.ObjectId(userId),
            reference: transaction_ref,
            amount: mongoose.Types.Decimal128.fromString(amountNumber.toString()),
            type: "CREDIT",
            status: "PENDING",
            description,
        });

        // Squad widget expects amount in kobo (integer)
        const amount_kobo = Math.round(amountNumber * 100);

        return NextResponse.json({
            status: true,
            message: "Transaction created",
            data: {
                transaction_ref,
                amount_kobo,
                publicKey: process.env.NEXT_PUBLIC_SQUAD_PUB_KEY,
                email,
                customer_name,
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