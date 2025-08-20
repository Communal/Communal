// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, maxlength: 255 },
    password: { type: String, required: true, maxlength: 255 },
    firstName: { type: String, required: true, maxlength: 100 },
    lastName: { type: String, required: true, maxlength: 100 },
    phone: { type: String, maxlength: 20 },
    address: { type: String },
    city: { type: String, maxlength: 100 },
    state: { type: String, maxlength: 100 },
    zipCode: { type: String, maxlength: 20 },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    profileImage: { type: String, maxlength: 500 },
    balance: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
