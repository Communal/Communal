import connectDB  from "@/config/db";
import Category from "@/db/schema/Category";

let categoryCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req, { params }) {
  const { id } = await params;

  if (categoryCache[id] && Date.now() - categoryCache[id].timestamp < CACHE_TTL) {
    return new Response(JSON.stringify(categoryCache[id].data), { status: 200 });
  }

  await connectDB();
  const categories = await Category.find({ company: id }).lean();

  categoryCache[id] = { data: categories, timestamp: Date.now() };

  return new Response(JSON.stringify(categories), { status: 200 });
}
