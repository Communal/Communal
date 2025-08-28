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

        const { reference, amount } = data;

        // 🔹 Extract userId from reference
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

        const finalStatus = event === "charge.success" ? "SUCCESS" : "FAILED";

        // check if transaction already exists
        const existingTx = await Transaction.findOne({ reference });
        if (existingTx) {
            return NextResponse.json({ status: true, message: "Transaction already logged" });
        }

        const transaction = new Transaction({
            userId: user._id,
            reference,
            amount: mongoose.Types.Decimal128.fromString(
                (parseFloat(amount) / 100).toString()
            ),
            type: "CREDIT",
            status: finalStatus,
            description: "Wallet in",
        });
        await transaction.save();

        // 🔹 Only update balance if payment succeeded
        if (finalStatus === "SUCCESS") {
            const currentBalance = parseFloat(user.balance.toString() || "0");
            const newBalance = currentBalance + parseFloat(amount) / 100;

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
