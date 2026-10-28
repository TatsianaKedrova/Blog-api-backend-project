import mongoose from "mongoose";
const dbName = process.env.DB_NAME || "blogs-posts";
const mongoUri = process.env.MONGODB_DRIVER || "mongodb://0.0.0.0:27017";
export const runMongooseDB = async (): Promise<void> => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    mongoose.set("autoIndex", process.env.NODE_ENV !== "production");
    const mongooseDB = await mongoose.connect(mongoUri, {
      dbName: dbName || "blogs-posts",
    });
    console.log(`MongoDB Atlas Connected: ${mongooseDB.connection.host}`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("❌ Can't connect to Mongoose DB: ", message);
    throw e;
  }
};
