import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;


if (!process.env.MONGODB_URI) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env");
}

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}