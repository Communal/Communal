import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Category from "@/db/schema/Category";

// POST → create subcategory
export async function POST(req) {
  try {
    await dbConnect();
    const { name, company } = await req.json(); // <-- changed to `company`

    if (!name || !company) {
      return NextResponse.json(
        { error: "Name and Company ID required" },
        { status: 400 }
      );
    }

    const sub = await Category.create({ name, company }); // <-- save with `company` field

    return NextResponse.json(sub, { status: 201 });
  } catch (err) {
    console.error("Subcategory add error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
