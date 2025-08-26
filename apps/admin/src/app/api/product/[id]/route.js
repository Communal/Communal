import connectDB from "@/config/db";
import Product from "@/db/schema/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(_req, { params }) {
  const { id } = await params;

  try {
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ products: [], count: 0 }, { status: 400 });
    }

    await connectDB();

    // Only return unsold products and include a count
    const products = await Product.find({ category: id, isSold: false })
      .select("_id name price info company category isSold")
      // .populate("company", "name")
      .populate("category", "name")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(
      { products, count: products.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to load products for category:", err);
    return NextResponse.json(
      { error: "Failed to load products", products: [], count: 0 },
      { status: 500 }
    );
  }
}
