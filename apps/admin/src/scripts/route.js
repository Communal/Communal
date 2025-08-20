// Create a temporary API route to seed test products
// app/api/seed-products/route.js
import mongoose from "mongoose";
import connectDB from "../config/db";
import Product from "../db/schema/Product";

export async function GET() {
  await connectDB();
  
  try {
    const testProducts = [
      {
        _id: new mongoose.Types.ObjectId("689b650e2c26952c09bbb88a"),
        name: "Test Product 1",
        price: 19.99,
        category: new mongoose.Types.ObjectId(), // Use real category ID
        info: "Test product description"
      },
      {
        _id: new mongoose.Types.ObjectId("689b650e2c26952c09bbb88b"),
        name: "Test Product 2",
        price: 29.99,
        category: new mongoose.Types.ObjectId(), // Use real category ID
        info: "Test product description"
      }
    ];

    await Product.insertMany(testProducts);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}