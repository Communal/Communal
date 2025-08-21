import connectDB from "@/config/db";
import Company from "@/db/schema/Company";

export async function GET() {
  await connectDB();

  try {
    const companies = await Company.find();
    return new Response(JSON.stringify({ companies }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
