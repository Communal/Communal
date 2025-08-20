// app/api/transaction-history/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/config/db";
import Transaction from "@/db/schema/Transaction";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();

    // 🔑 Extract JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // 🔍 Filters from query params
    const { searchParams } = new URL(req.url);
    const filter = { userId: new mongoose.Types.ObjectId(userId) };

    if (searchParams.get("type")) filter.type = searchParams.get("type");
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("description"))
      filter.description = searchParams.get("description");

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
