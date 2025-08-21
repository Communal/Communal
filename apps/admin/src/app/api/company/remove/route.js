import connectDB from "@/config/db";
import Company from "@/db/schema/Company";

export async function DELETE(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    const deleted = await Company.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Company deleted", deleted }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
