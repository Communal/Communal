// api/company/[id]/categories/route.js
import connectDB from "@/config/db";
import Company from "@/db/schema/Company";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;
    const company = await Company.findById(id).populate("categories");
    // assumes Company schema has a categories field (array of ObjectIds)

    if (!company) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ categories: company.categories }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}