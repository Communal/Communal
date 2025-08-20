// scripts/populateCategories.js
import mongoose from "mongoose";
import Category from "./../db/schema/Category.js"; // adjust path if needed
import Company from "./../db/schema/Company.js"; // for ref lookup

const MONGO_URI =
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017/communal-shop";
async function run() {
  await mongoose.connect(MONGO_URI);

  // Find the company to link (example: 'Company A')
  const company = await Company.findOne({ name: "Express Vpn" });
  if (!company) {
    console.error("Company not found. Please create the company first.");
    process.exit(1);
  }

  // const categories = [
  //   {
  //     name: "Male USA Instagram Dating (location)",
  //     company: company._id,
  //   },
  //   {
  //     name: "Female USA Instagram Dating (location)",
  //     company: company._id,
  //   },
  //   {
  //     name: "Random Instagram mostly Asian",
  //     company: company._id,
  //   },
  //   {
  //     name: "Normal USA Instagram Non Dating",
  //     company: company._id,
  //   },
  //   {
  //     name: "Code 6 USA Instagram Non Dating",
  //     company: company._id,
  //   },
  //   {
  //     name: "Code 7 USA Instagram Non Dating",
  //     company: company._id,
  //   },
  //   {
  //     name: "Code 8 USA Instagram Non Dating",
  //     company: company._id,
  //   },
  //   {
  //     name: "Europe Instagram",
  //     company: company._id,
  //   },
  //   {
  //     name: "Old Nigeria Instagram",
  //     company: company._id,
  //   },
  // ];

  // const categories = [
  //   {
  //     name: "500+ Followers,old Foreign Instagram accounts $7",
  //     company: company._id,
  //   },
  //   {
  //     name: "1000+ followers,old foreign instagram Account $10",
  //     company: company._id,
  //   },
  //   {
  //     name: "2000+ followers,old foreign instagram $13",
  //     company: company._id,
  //   },
  // ];

const categories = [
  {
    name: "EXPRESS VPN (1 MONTH)",
    company: company._id,
  }
]

  // const categories = [
  //   {
  //     name: "500+ Followers, old Foreign Twitter (x) accounts $12",
  //     company: company._id,
  //   },
  //   {
  //     name: "1000+ Followers, old foreign Twitter (x) account $16",
  //     company: company._id,
  //   },
  //   {
  //     name: "30+ Followers, old & New Foreign Twitter (x) accounts $3",
  //     company: company._id,
  //   },
  //   {
  //     name: "100+ Followers, old & New foreign Twitter (x) account $5",
  //     company: company._id,
  //   },
  // ];

  await Category.insertMany(categories);
  console.log("Categories populated.");
  mongoose.connection.close();
}

run().catch((err) => console.error(err));
