import { Db, MongoClient } from "mongodb";
import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { runMongooseDB } from "../mongoose/mongooseDB";
import mongoose from "mongoose";

const dbName = process.env.DB_NAME || "blogs-posts";
const mongoUri = process.env.MONGODB_DRIVER || "mongodb://0.0.0.0:27017";
const client: MongoClient = new MongoClient(mongoUri as string);
export const mongoDB: Db = client.db(dbName);

export const refreshTokensBlacklistedCollection =
  mongoDB.collection<RefreshTokensBlacklistDB>("refresh-tokens-blacklisted");

export const runDB = async () => {
  try {
    await runMongooseDB(mongoUri, dbName);
    await client.connect();
    console.log("Connected successfully to native mongo driver");
    await mongoDB.command({ ping: 1 });
    console.log("Client connected");
  } catch (e) {
    console.log("Can't connect to DB: ", e);
    await client.close();
    await mongoose.disconnect();
    throw e;
  }
};
