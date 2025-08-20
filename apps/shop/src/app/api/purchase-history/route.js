import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import PurchaseHistory from "@/db/schema/PurchaseHistory";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("search") || "";

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    await dbConnect();

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (search.trim()) {
      // Case-insensitive match on name
      query.name = { $regex: search.trim(), $options: "i" };
    }

    const purchases = await PurchaseHistory.find(query)
      .populate("productId", "name price category info")
      .sort({ createdAt: -1 });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch purchase history" },
      { status: 500 }
    );
  }
}
