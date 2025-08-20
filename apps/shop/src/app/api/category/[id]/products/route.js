import connectDB from "../../../../../config/db";
import Product from "../../../../../db/schema/Product";

let productCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req, { params }) {
  const { id } = await params;

  if (productCache[id] && Date.now() - productCache[id].timestamp < CACHE_TTL) {
    return new Response(JSON.stringify(productCache[id].data), { status: 200 });
  }

  await connectDB();
  const products = await Product.find({ category: id, isSold: false }).lean();

  productCache[id] = { data: products, timestamp: Date.now() };

  return new Response(JSON.stringify(products), { status: 200 });
}
