import dbConnect from "@/config/db";
import Product from "@/db/schema/Product";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find().populate("category").lean();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
