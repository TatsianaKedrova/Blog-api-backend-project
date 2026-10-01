import { Db, MongoClient } from "mongodb";
import { PostDBType } from "./dto/postsDTO/PostModel";
import { BlogDBType } from "./dto/blogsDTO/BlogModel";
import { UserDBType } from "./dto/usersDTO/usersDTO";
import { CommentDBType } from "./dto/commentsDTO/commentsDTO";
import { RefreshTokensBlacklistDB } from "./dto/authDTO/authDTO";
import { ApiCallsDBType } from "./dto/apiCallsDTO/apiCallsDTO";
import { SecurityDeviceDBType } from "./dto/securityDevicesDTO/securityDevicesDTO";
const mongoUri = process.env.MONGODB_DRIVER || "mongodb://0.0.0.0:27017";
const client: MongoClient = new MongoClient(mongoUri as string);
const dbName = "blogs-posts";
export const mongoDB: Db = client.db(dbName);

export const blogsCollection = mongoDB.collection<BlogDBType>("blogs");
export const postsCollection = mongoDB.collection<PostDBType>("posts");
export const videosCollection = mongoDB.collection<any>("videos");
export const usersCollection = mongoDB.collection<UserDBType>("users");
export const commentsCollection = mongoDB.collection<CommentDBType>("comments");
export const refreshTokensBlacklistedCollection =
  mongoDB.collection<RefreshTokensBlacklistDB>("refresh-tokens-blacklisted");
export const securityDevicesCollection =
  mongoDB.collection<SecurityDeviceDBType>("securityDevices");
export const apiCallsCollection =
  mongoDB.collection<ApiCallsDBType>("apiCalls");

export const runDB = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to mongo server");
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

    // --- Unique User Indexes ---
    await usersCollection.createIndex(
      { "accountData.email": 1 },
      { name: "email", unique: true },
    );
    await usersCollection.createIndex(
      { "accountData.login": 1 },
      { name: "login", unique: true },
    );
    console.log("User unique indexes established");

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
    throw e;
  }
};
