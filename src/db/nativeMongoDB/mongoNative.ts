import { Db, MongoClient } from "mongodb";
import { BlogDBType } from "../../dto/blogsDTO/BlogModel";
import { PostDBType } from "../../dto/postsDTO/PostModel";
import { CommentDBType } from "../../dto/commentsDTO/commentsDTO";
import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { SecurityDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";
import { runMongooseDB } from "../mongoose/db";
import mongoose from "mongoose";

const dbName = process.env.DB_NAME || "blogs-posts";
const mongoUri = process.env.MONGODB_DRIVER || "mongodb://0.0.0.0:27017";
const client: MongoClient = new MongoClient(mongoUri as string);
export const mongoDB: Db = client.db(dbName);

export const blogsCollection = mongoDB.collection<BlogDBType>("blogs");
export const postsCollection = mongoDB.collection<PostDBType>("posts");
export const videosCollection = mongoDB.collection<any>("videos");
export const commentsCollection = mongoDB.collection<CommentDBType>("comments");
export const refreshTokensBlacklistedCollection =
  mongoDB.collection<RefreshTokensBlacklistDB>("refresh-tokens-blacklisted");
export const securityDevicesCollection =
  mongoDB.collection<SecurityDeviceDBType>("securityDevices");
export const apiCallsCollection =
  mongoDB.collection<ApiCallsDBType>("apiCalls");

export const runDB = async () => {
  try {
    await runMongooseDB(mongoUri, dbName);
    await client.connect();
    console.log("Connected successfully to native mongo driver");
    await mongoDB.command({ ping: 1 });
    console.log("Client connected");
    await securityDevicesCollection.createIndex(
      { refreshTokenExpirationDate: 1 },
      { expireAfterSeconds: 0 },
    );
    console.log("TTL Index for securityDevices collection established");
    // --- Security Devices Indexes ---
    await securityDevicesCollection.createIndex({
      userId: 1,
      refreshTokenExpirationDate: -1,
    });
    console.log("Compound query index for user device lookup established");

    // --- Api Calls / Rate Limiting Indexes ---
    // 1. Compound index for blazing-fast lookups on every single incoming HTTP request
    await apiCallsCollection.createIndex({
      ip: 1,
      url: 1,
      date: -1,
    });

    // 2. TTL index to automatically purge logs older than 20 seconds background-wise
    await apiCallsCollection.createIndex(
      {
        date: 1,
      },
      { expireAfterSeconds: 20 },
    );
    console.log("Rate limiter indexes (Performance + TTL Cleanup) established");
  } catch (e) {
    console.log("Can't connect to DB: ", e);
    await client.close();
    await mongoose.disconnect();
    throw e;
  }
};
