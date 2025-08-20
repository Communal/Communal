// seedPurchaseHistory.js
import mongoose from "mongoose";
import PurchaseHistory from "../db/schema/PurchaseHistory.js"; // adjust path if needed

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://communalshop0:OJ22Qnl6tUMpqizW@communal-shop.3pw3tej.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Example user/product IDs — replace with real ones from your DB
    const userId = "6898ff9b394fef3ef35e47c9";
    const productIds = [
      "689d3399d5ca26cff61bf12c",
      "689d3399d5ca26cff61bf12d",
      "689d3399d5ca26cff61bf12e",
      "689d3399d5ca26cff61bf12f",
    ];

    // Sample data
    const testData = [
      {
        userId,
        name: "Netflix Subscription",
        info: "1 month premium plan",
        productId: productIds[0],
        purchaseDate: new Date("2025-08-01"),
        priceAtPurchase: 5000,
      },
      {
        userId,
        name: "Spotify Premium",
        info: "6 month student discount",
        productId: productIds[1],
        purchaseDate: new Date("2025-07-15"),
        priceAtPurchase: 2500,
      },
      {
        userId,
        name: "Adobe Photoshop",
        info: "1 year license",
        productId: productIds[2],
        purchaseDate: new Date("2025-05-20"),
        priceAtPurchase: 15000,
      },
      {
        userId,
        name: "Adobe Studio",
        info: "2 year license",
        productId: productIds[3],
        purchaseDate: new Date("2025-05-20"),
        priceAtPurchase: 15000,
      },
    ];

    // Insert into DB
    await PurchaseHistory.insertMany(testData);
    console.log(`✅ Inserted ${testData.length} purchase records`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();
