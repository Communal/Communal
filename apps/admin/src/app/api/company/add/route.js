import connectDB from "@/config/db";
import Company from "@/db/schema/Company";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, logo } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const company = new Company({ name, logo });
    await company.save();

    return new Response(JSON.stringify({ message: "Company added", company }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
