import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
