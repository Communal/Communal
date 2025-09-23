import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxlength: 255, trim: true, lowercase: true, index: true },
  password: { type: String, required: true, maxlength: 255 },
  firstName: { type: String, required: true, maxlength: 100, trim: true },
  lastName: { type: String, required: true, maxlength: 100, trim: true },
  phone: { type: String, maxlength: 20 },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER", index: true },
  balance: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  resetPasswordToken: { type: String, default: null, index: true },
  resetPasswordTokenExpires: { type: Date, default: null },
}, { timestamps: true });

// Optional compound index for frequent queries
UserSchema.index({ email: 1, role: 1 });

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
