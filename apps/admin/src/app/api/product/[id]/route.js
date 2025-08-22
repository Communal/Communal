import connectDB from "@/config/db";
import Product from "@/db/schema/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(_req, { params }) {
  const { id } = await params; // category id
  try {
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ products: [] }, { status: 400 });
    }

    await connectDB();
    const products = await Product.find({ category: id })
      .select("_id name price info company category")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
