// scripts/transactionPopulate.js
import mongoose from "mongoose";
// import dotenv from "dotenv";
import Transaction from "../db/schema/Transaction.js";

// dotenv.config();

async function main() {
  await mongoose.connect("mongodb+srv://communalshop0:OJ22Qnl6tUMpqizW@communal-shop.3pw3tej.mongodb.net/");
  console.log("Connected to MongoDB ✅");

  // Get the user ID from CLI args (e.g., node transactionPopulate.js <userId>)
  const manualUserId = process.argv[2];

  if (!manualUserId) {
    console.error("❌ Please provide a userId as an argument.");
    console.error(
      "Example: node transactionPopulate.js 66b9e1f3a8c12b4e2c123456"
    );
    process.exit(1);
  }

  // Define all possible values according to your schema
  const types = ["CREDIT", "DEBIT"];
  const statuses = ["SUCCESS", "FAILED"];
  const descriptions = ["Wallet in", "Withdrawal"];

  const transactions = [];

  for (const type of types) {
    for (const status of statuses) {
      for (const description of descriptions) {
        // Create at least 2 for each condition
        for (let i = 0; i < 2; i++) {
          transactions.push({
            userId: manualUserId,
            amount: mongoose.Types.Decimal128.fromString(
              (Math.floor(Math.random() * 900) + 100).toString()
            ), // random amount between 100–999
            type,
            status,
            description,
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 1_000_000_000)
            ), // random past date
          });
        }
      }
    }
  }

  await Transaction.insertMany(transactions);

  console.log(
    `✅ Inserted ${transactions.length} transactions for user ${manualUserId}`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
