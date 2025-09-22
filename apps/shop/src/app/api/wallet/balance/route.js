import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/db/schema/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
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

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            balance: parseFloat(user.balance.toString()),
        });
    } catch (err) {
        console.error("Balance error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
