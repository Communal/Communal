// api/product/add/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";
import Category from "@/db/schema/Category";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { price, info, company, category, data } = body || {};

    if (price === undefined || !company || !category) {
      return NextResponse.json(
        { error: "Price, company, and category are required" },
        { status: 400 }
      );
    }

    // fetch category to get its name
    const categoryDoc = await Category.findById(category).lean();
    if (!categoryDoc) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const created = await Product.create({
      name: categoryDoc.name,   // auto set to category name
      price: numericPrice,
      info: info || "",
      data: data || "",
      company,
      category,
      isSold: false,
    });

    const populated = await Product.findById(created._id)
      .populate("category", "name company")
      .lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("api/product/add error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
