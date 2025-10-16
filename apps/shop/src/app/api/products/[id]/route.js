// src/app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/db/schema/Product";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // ✅ Validate ID
    if (!id || id === "null" || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid or missing product ID" },
        { status: 400 }
      );
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Fetch product and populate category
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ✅ Return product data
    return NextResponse.json(product);
  } catch (err) {
    console.error("Error fetching product details:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
