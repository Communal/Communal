// api/product/unsold-counts/route.js
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";

export default async function handler(req, res) {
  await dbConnect();
  try {
    // Aggregate unsold products grouped by category
    const agg = await Product.aggregate([
      { $match: { isSold: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      // Lookup category metadata (name). Assumes categories collection is "categories".
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: "$category.name",
          count: 1,
        },
      },
    ]);

    // If you want entries for categories with zero, you'd fetch categories and left-join them.
    res.status(200).json({ counts: agg });
  } catch (err) {
    console.error("Failed to aggregate unsold counts:", err);
    res.status(500).json({ error: "Failed to fetch unsold counts" });
  }
}
