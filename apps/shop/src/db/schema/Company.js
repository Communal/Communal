// models/Company.js
import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
});

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
