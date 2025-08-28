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
        const verifyRes = await fetch("https://api.korapay.com/merchant/api/v1/charges/" + reference, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || verifyData.data?.status !== "success") {
            // Log failed transaction
            // await Transaction.create({
            //     userId,
            //     reference,
            //     amount: verifyData?.data?.amount || 0,
            //     type: "CREDIT",
            //     status: "FAILED",
            //     description: "Wallet in",
            // });

            return NextResponse.json(
                { success: false, error: "Payment not successful" },
                { status: 400 }
            );
        }

        // ✅ If successful, update user balance
        // const amount = verifyData.data.amount / 100; // usually in kobo
        // const user = await User.findById(userId);

        // user.balance = parseFloat(user.balance) + amount;
        // await user.save();

        // // ✅ Log successful transaction
        // await Transaction.create({
        //     userId,
        //     reference,
        //     amount,
        //     type: "CREDIT",
        //     status: "SUCCESS",
        //     description: "Wallet in",
        // });

        return NextResponse.json({ success: true, message: "Wallet funded" });
    } catch (err) {
        console.error("Verify error:", err);
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
