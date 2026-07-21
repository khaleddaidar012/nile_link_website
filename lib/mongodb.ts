import mongoose from "mongoose"

let cached = global as unknown as { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  if (!cached.mongoose) {
    cached.mongoose = { conn: null, promise: null }
  }

  if (cached.mongoose.conn) return cached.mongoose.conn

  if (!cached.mongoose.promise) {
    cached.mongoose.promise = mongoose.connect(process.env.MONGODB_URI)
  }

  cached.mongoose.conn = await cached.mongoose.promise
  return cached.mongoose.conn
}
