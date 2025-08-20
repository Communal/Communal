// actions/auth.js
"use server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../config/db";
import User from "../../db/schema/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // keep in .env file
const TOKEN_EXPIRY = "1h"; // 1 hour (you can set "7d", "30m", etc.)

// Generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Handle Signup
export async function handleSignup(prevState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!firstName || !lastName || !email || !password) {
    return { ...prevState, error: "All fields are required" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ...prevState, error: "Please enter a valid email address" };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { ...prevState, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "USER",
      balance: 0,
    });

    const token = generateToken(newUser);

    const safeUser = {
      id: newUser._id.toString(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      balance: 0,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return {
      success: "Signup successful!",
      error: "",
      token,
      user: safeUser,
    };
  } catch (error) {
    console.error("Error during signup:", error);
    return { ...prevState, error: "Signup failed. Please try again." };
  }
}

// Handle Login
export async function handleLogin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { ...prevState, error: "Email and password are required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ...prevState, error: "Please enter a valid email address" };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { ...prevState, error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { ...prevState, error: "Invalid email or password" };
    }

    user.updatedAt = new Date();
    await user.save();

    const token = generateToken(user);

    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      role: user.role,
      profileImage: user.profileImage,
      balance: user.balance ? parseFloat(user.balance.toString()) : 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      success: "Login successful!",
      error: "",
      token,
      user: safeUser,
    };
  } catch (error) {
    console.error("Error during login:", error);
    return { ...prevState, error: "Login failed. Please try again." };
  }
}
