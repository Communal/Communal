import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Category from "@/db/schema/Category";

// DELETE a Category
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
