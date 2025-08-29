// app/api/wallet/verify/route.js
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const { reference, userId } = await req.json();

        if (!reference || !userId) {
            return NextResponse.json(
                { success: false, error: "Missing reference or userId" },
                { status: 400 }
            );
        }

        // ✅ Verify transaction with Korapay API
        const verifyRes = await fetch(
            `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const verifyData = await verifyRes.json();

        // If not successful
        if (!verifyRes.ok || verifyData.data?.status !== "success") {
            await Transaction.create({
                userId,
                reference,
                amount: verifyData?.data?.amount
                    ? parseFloat(verifyData.data.amount)
                    : 0,
                type: "CREDIT",
                status: "FAILED",
                description: "Wallet in",
            });

            return NextResponse.json(
                { success: false, error: "Payment not successful" },
                { status: 400 }
            );
        }

        // ✅ Amount (Korapay returns in kobo)
        const amount = parseFloat(verifyData.data.amount);

        // ✅ Update user balance safely
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const currentBalance = parseFloat(user.balance?.toString() || "0");
        user.balance = currentBalance + amount;
        await user.save();

        // check if transaction already exists
        const existingTx = await Transaction.findOne({ reference });
        if (existingTx) {
            return NextResponse.json({ status: true, message: "Transaction already exists" });
        }


        // ✅ Log successful transaction
        await Transaction.create({
            userId,
            reference,
            amount,
            type: "CREDIT",
            status: "SUCCESS",
            description: "Wallet in",
        });

        return NextResponse.json({
            success: true,
            message: "Wallet funded successfully",
            newBalance: user.balance.toString(),
        });
    } catch (err) {
        console.error("Verify error:", err);
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}