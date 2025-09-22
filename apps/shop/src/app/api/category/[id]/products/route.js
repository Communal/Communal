import connectDB from "@/config/db";
import Product from "@/db/schema/Product";

export async function GET(req, { params }) {
  const { id } = await params;

  await connectDB();

  // Only return unsold products
  const products = await Product.find({ category: id, isSold: false }).lean();

  return new Response(JSON.stringify(products), { status: 200 });
}
