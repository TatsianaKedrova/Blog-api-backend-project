import { Db, MongoClient } from "mongodb";
import { BlogDBType } from "../../dto/blogsDTO/blogDTO";
import { PostDBType } from "../../dto/postsDTO/postDTO";
import { CommentDBType } from "../../dto/commentsDTO/commentsDTO";
import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";
import { runMongooseDB } from "../mongoose/mongooseDB";
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
export const apiCallsCollection =
  mongoDB.collection<ApiCallsDBType>("apiCalls");

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
