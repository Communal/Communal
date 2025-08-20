// scripts/seedCompanies.js
import mongoose from "mongoose";
import Company from "./schema/Company.js";

// dotenv.config(); // Loads .env for DB connection

const companies = [
  {
    name: "Facebook",
    src: "/icons/facebook@3x 1.png",
  },
  {
    name: "Instagram",
    src: "/icons/instagram@512px 1.png",
  },
  {
    name: "Twitter",
    src: "/icons/twitter@512px 1.png",
  },
  {
    name: "LinkedIn",
    src: "/icons/linkedin@3x 1.png",
  },
  {
    name: "Tiktok",
    src: "/icons/tik_tok@512px 1.png",
  },
  {
    name: "Google Voice",
    src: "/icons/google-voice8556 1.png",
  },
  {
    name: "Pia VPN",
    src: "/icons/images 1.png",
  },
  {
    name: "Express Vpn",
    src: "/icons/download 1.png",
  },
  {
    name: "Netflix Logs",
    src: "/icons/netflix-mobile-application-logo-free-png 1.png",
  },
];

async function seed() {
  try {
    await mongoose.connect();

    for (const company of companies) {
      // Only insert if it doesn't exist yet
      const exists = await Company.findOne({ name: company.name });
      if (!exists) {
        await Company.create(company);
        console.log(`✅ Inserted: ${company.name}`);
      } else {
        console.log(`⏩ Skipped: ${company.name} (already exists)`);
      }
    }

    mongoose.connection.close();
    console.log("🌱 Seeding complete!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
