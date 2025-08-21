import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, price, info, company, category } = await req.json();

    if (!name || !price || !company || !category) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const product = await Product.create({ name, price, info, company, category });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
