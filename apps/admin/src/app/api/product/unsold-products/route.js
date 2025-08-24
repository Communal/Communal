// app/api/product/counts/route.js
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Aggregate once, no category grouping
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$isSold",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation result into { sold, unsold }
    let sold = 0;
    let unsold = 0;
    for (const r of result) {
      if (r._id === true) sold = r.count;
      else unsold = r.count;
    }

    return NextResponse.json({ sold, unsold }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch counts:", err);
    return NextResponse.json(
      { error: "Failed to fetch product counts" },
      { status: 500 }
    );
  }
}
