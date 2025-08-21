import dbConnect from "@/config/db";
import Category from "@/db/schema/Category";
export default async function handler(req, res) {
  await dbConnect();
  try {
    const subCategories = await Category.find().populate("company", "name");
    res.status(200).json({ subCategories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
}
