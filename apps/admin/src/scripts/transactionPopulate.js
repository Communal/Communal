import mongoose from "mongoose";
import Transaction from "../db/schema/Transaction.js";
import User from "../db/schema/User.js";

async function seedTransactions() {
  try {
    await mongoose.connect("");

    console.log("Connected to MongoDB ✅");

    // Get a random user to attach to transactions
    const users = await User.find();
    if (users.length === 0) {
      console.log("No users found, please create a user first.");
      process.exit(1);
    }

    const sampleDescriptions = ["Wallet in", "Withdrawal"];
    const sampleTypes = ["CREDIT", "DEBIT"];

    let fakeTransactions = [];

    for (let i = 0; i < 30; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAmount = (Math.random() * 10000 + 1000).toFixed(2);
      const randomType =
        sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
      const randomDescription =
        sampleDescriptions[
          Math.floor(Math.random() * sampleDescriptions.length)
        ];
      const randomStatus = Math.random() > 0.2 ? "SUCCESS" : "FAILED"; // 80% success

      fakeTransactions.push({
        userId: randomUser._id,
        amount: randomAmount,
        type: randomType,
        status: randomStatus,
        description: randomDescription,
      });
    }

    await Transaction.insertMany(fakeTransactions);
    console.log("✅ Inserted 30 fake transactions!");

    process.exit();
  } catch (err) {
    console.error("Error seeding transactions:", err);
    process.exit(1);
  }
}

seedTransactions();
