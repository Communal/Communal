// api/product/add/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, price, info, company, category } = body || {};

    if (!name || price === undefined || !company || !category) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // Ensure price is number (store schema likely expects Number)
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // create product with isSold explicitly false
    const created = await Product.create({
      name,
      price: numericPrice,
      info: info || "",
      company,
      category,
      isSold: false,
    });

    // Populate company and category names for immediate client use
    const populated = await Product.findById(created._id)
      // .populate("Company", "name logo")
      .populate("category", "name company")
      .lean();

    // return the populated product object directly (client code expects product)
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("api/product/add error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
