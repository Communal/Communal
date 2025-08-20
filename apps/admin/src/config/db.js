// import mongoose from 'mongoose';

// const DATABASE_URL = process.env.DATABASE_URL;

// if (!DATABASE_URL) throw new Error("Please define DATABASE_URL");

// let isConnected = false;

// export default async function connectDB() {
//   if (isConnected) return;
//   const db = await mongoose.connect(MONGODB_URI);
//   isConnected = db.connections[0].readyState;
// }


// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

 console.log(MONGODB_URI);

if (!MONGODB_URI) {
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