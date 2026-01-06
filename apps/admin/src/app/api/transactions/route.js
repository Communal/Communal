import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Transaction from "@/db/schema/Transaction";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        // The exchange rate used to multiply the money flow
        const EXCHANGE_RATE = 1500;

        // Only successful wallet credits
        const query = {
            type: "CREDIT",
            status: "SUCCESS",
            description: "Wallet in",
        };

        const [transactions, total, totalAmount] = await Promise.all([
            Transaction.find(query)
                .populate("userId", "firstName lastName email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Transaction.countDocuments(query),

            Transaction.aggregate([
                { $match: query },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        return NextResponse.json({
            // 1. DIVIDE THE TOTAL AGGREGATED AMOUNT
            totalAmount:
                totalAmount.length > 0
                    ? parseFloat(totalAmount[0].total.toString()) / EXCHANGE_RATE
                    : 0,

            // 2. DIVIDE INDIVIDUAL TRANSACTION AMOUNTS
            transactions: transactions.map((tx) => ({
                id: tx._id,
                user: {
                    name: tx.userId ? `${tx.userId.firstName} ${tx.userId.lastName}` : "Unknown User", // Added safety check
                    email: tx.userId ? tx.userId.email : "N/A",
                },
                amount: parseFloat(tx.amount.toString()) / EXCHANGE_RATE,
                date: tx.createdAt,
            })),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Admin transactions API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}