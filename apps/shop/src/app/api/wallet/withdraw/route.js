import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/db/schema/User";
import Transaction from "@/db/schema/Transaction";
import Product from "@/db/schema/Product";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const { productIds, amount, password } = await req.json(); // productIds = [array]
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json({ error: "No product selected" }, { status: 400 });
        }
        if (!amount || !password) {
            return NextResponse.json({ error: "Amount and password required" }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const currentBalance = parseFloat(user.balance.toString());
        if (currentBalance < amount) {
            return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
        }

        // Deduct balance
        user.balance = currentBalance - amount;
        await user.save();

        const reference = `wd_${crypto.randomBytes(8).toString("hex")}`;

        // Record transaction
        await Transaction.create({
            userId: user._id,
            reference,
            type: "DEBIT",
            amount,
            status: "SUCCESS",
            description: "Wallet in",
        });

        // Mark products as sold
        await Product.updateMany({ _id: { $in: productIds } }, { isSold: true });

        return NextResponse.json({
            success: true,
            reference,
            newBalance: parseFloat(user.balance.toString()),
        });
    } catch (err) {
        console.error("Withdraw error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
