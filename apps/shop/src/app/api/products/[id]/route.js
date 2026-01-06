import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/db/schema/Product";
import Category from "@/db/schema/Category";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || id === "null" || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid or missing product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. OPTIONAL SAFETY: Ensure the model is initialized 
    // (Just importing it above is usually enough, but this line prevents unused var warnings)
    console.log("Categories loaded:", !!Category);

    const product = await Product.findById(id).populate("category");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("Error fetching product details:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}