import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function handler(req, res) {
  const { categoryId } = req.query;

  await connectDB();
  const products = await Product.find({ category: categoryId }).lean();

  res.status(200).json(products);
}
