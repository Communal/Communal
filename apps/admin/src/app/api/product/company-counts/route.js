// app/api/product/company-counts/route.js
import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const result = await Product.aggregate([
      // Lookup category to get the company
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Group by company + isSold
      {
        $group: {
          _id: { company: "$category.company", isSold: "$isSold" },
          count: { $sum: 1 },
        },
      },

      // Reshape into { company, sold, unsold }
      {
        $group: {
          _id: "$_id.company",
          counts: {
            $push: { isSold: "$_id.isSold", count: "$count" },
          },
        },
      },

      // Lookup company details
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      // Final shape
      {
        $project: {
          _id: 0,
          companyId: "$company._id",
          companyName: "$company.name",
          companyLogo: "$company.logo",
          sold: {
            $ifNull: [
              {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$counts",
                        cond: { $eq: ["$$this.isSold", true] },
                      },
                    },
                    as: "c",
                    in: "$$c.count",
                  },
                },
              },
              0,
            ],
          },
          unsold: {
            $ifNull: [
              {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$counts",
                        cond: { $eq: ["$$this.isSold", false] },
                      },
                    },
                    as: "c",
                    in: "$$c.count",
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ]);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch company counts:", err);
    return NextResponse.json(
      { error: "Failed to fetch company product counts" },
      { status: 500 }
    );
  }
}