import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";

export default async function handler(req, res) {
  await dbConnect();
  try {
    const products = await Product.find().populate("company category", "name");
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
