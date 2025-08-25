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
            totalAmount:
                totalAmount.length > 0
                    ? parseFloat(totalAmount[0].total.toString())
                    : 0,
            transactions: transactions.map((tx) => ({
                id: tx._id,
                user: {
                    name: `${tx.userId.firstName} ${tx.userId.lastName}`,
                    email: tx.userId.email,
                },
                amount: parseFloat(tx.amount.toString()),
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
