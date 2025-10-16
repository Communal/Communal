// app/api/wallet/withdraw/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/db/schema/User";
import Transaction from "@/db/schema/Transaction";
import Product from "@/db/schema/Product";
import PurchaseHistory from "@/db/schema/PurchaseHistory";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { productIds, amount, password } = await req.json(); // productIds = [array]
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "No product selected" },
        { status: 400 }
      );
    }
    if (amount == null || !password) {
      return NextResponse.json(
        { error: "Amount and password required" },
        { status: 400 }
      );
    }

    // load user
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // verify password
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // parse amount to number
    const withdrawAmount = Number(amount);
    if (Number.isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // check balance
    const currentBalance = parseFloat(user.balance?.toString() || "0");
    if (currentBalance < withdrawAmount) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    // load products
    // ensure we convert string ids to ObjectId or leave as-is if already ObjectId
    const objectIds = productIds.map((id) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: objectIds } });

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missing = productIds.filter((id) => !foundIds.includes(String(id)));
      return NextResponse.json(
        { error: "Some products not found", missing },
        { status: 404 }
      );
    }

    // check for already sold products
    const sold = products.filter((p) => p.isSold);
    if (sold.length > 0) {
      return NextResponse.json(
        {
          error: "Some products are already sold",
          sold: sold.map((p) => ({ id: p._id, name: p.name })),
        },
        { status: 400 }
      );
    }

    // Deduct user balance (preserve Decimal128)
    const newBalanceValue = currentBalance - withdrawAmount;
    user.balance = mongoose.Types.Decimal128.fromString(
      newBalanceValue.toFixed(2)
    );
    await user.save();

    // create transaction (DEBIT)
    const reference = `wd_${crypto.randomBytes(8).toString("hex")}`;
    await Transaction.create({
      userId: user._id,
      reference,
      type: "DEBIT",
      amount: mongoose.Types.Decimal128.fromString(withdrawAmount.toFixed(2)),
      status: "SUCCESS",
      description: "Withdrawal",
    });

    // create purchase history entries (one per product)
    const now = new Date();
    const purchaseDocs = products.map((p) => ({
      userId: user._id,
      name: p.name || p.title || "Unnamed product",
      info: p.info || "",
      productId: p._id,
      purchaseDate: now,
      priceAtPurchase:
        typeof p.price === "number" ? p.price : Number(p.price) || 0,
    }));

    const createdPurchases = await PurchaseHistory.insertMany(purchaseDocs);

    // mark products as sold
    await Product.updateMany(
      { _id: { $in: objectIds } },
      { $set: { isSold: true } }
    );

    return NextResponse.json({
      success: true,
      reference,
      newBalance: parseFloat(user.balance.toString()),
      purchases: createdPurchases,
    });
  } catch (err) {
    console.error("Withdraw error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
