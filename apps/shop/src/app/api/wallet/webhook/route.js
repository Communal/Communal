// app/api/wallet/webhook/route.js
import connectDB from "@/config/db";
import User from "@/db/schema/User";
import Transaction from "@/db/schema/Transaction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const { event, data } = body;

        // We only care about Korapay's events
        if (!["charge.success", "charge.failed"].includes(event)) {
            return NextResponse.json({ status: true, message: "Event ignored" });
        }

        const { reference, amount, status } = data;

        // 🔹 Extract userId from reference (assuming you encoded it like ref_${Date.now()}_UID_${userId})
        const refParts = reference.split("_UID_");
        const userId = refParts[1];

        if (!mongoose.isValidObjectId(userId)) {
            return NextResponse.json(
                { status: false, message: "Invalid userId in reference" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { status: false, message: "User not found" },
                { status: 404 }
            );
        }

        // 🔹 Always log the transaction
        const transaction = new Transaction({
            userId: user._id,
            reference,
            amount: mongoose.Types.Decimal128.fromString(amount.toString()),
            type: "CREDIT",
            status: status === "success" ? "SUCCESS" : "FAILED",
            description: "Wallet in",
        });
        await transaction.save();

        // 🔹 Only update balance if payment succeeded
        if (status === "success") {
            const currentBalance = parseFloat(user.balance.toString());
            const newBalance = currentBalance + parseFloat(amount);

            user.balance = mongoose.Types.Decimal128.fromString(newBalance.toString());
            await user.save();
        }

        return NextResponse.json({ status: true, message: "Webhook processed" });
    } catch (err) {
        console.error("Webhook Error:", err);
        return NextResponse.json(
            { status: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}
