import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
