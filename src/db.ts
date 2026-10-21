import mongoose from "mongoose";

export const runMongooseDB = async (
  mongoUri: string,
  dbName: string,
): Promise<void> => {
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
