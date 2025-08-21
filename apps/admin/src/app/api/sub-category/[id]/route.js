import connectDB from "@/config/db";
import Category from "@/db/schema/Category";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(_req, { params }) {
  const { id } = await params; // company id from URL

  try {
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ subCategories: [] }, { status: 400 });
    }

    await connectDB();

    // Filter by `company` field in your schema
    const subCategories = await Category.find({ company: id })
      .select("_id name company")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ subCategories }, { status: 200 });
  } catch (err) {
    console.error("Category GET error:", err);
    return NextResponse.json(
      { error: "Failed to load subcategories" },
      { status: 500 }
    );
  }
}
