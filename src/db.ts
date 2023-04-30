import { Db, MongoClient } from "mongodb";
import { PostDBType } from "./dto/postsDTO/PostModel";
import * as dotenv from "dotenv";
import { BlogDBType } from "./dto/blogsDTO/BlogModel";
dotenv.config();
const mongoUri =/* process.env.MONGO_URL*/ "mongodb://127.0.0.1:27017/"

const client: MongoClient = new MongoClient(mongoUri);
const dbName = "blogs-posts";
export const mongoDB: Db = client.db(dbName);

export const blogsCollection = mongoDB.collection<BlogDBType>("blogs");
export const postsCollection = mongoDB.collection<PostDBType>("posts");
export const videosCollection = mongoDB.collection<PostDBType>("videos");

export const runDB = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to mongo server");
    await mongoDB.command({ ping: 1 });
    console.log("Client connected");
  } catch (e) {
    console.log("Can't connect to DB: ", e);
    await client.close();
  }
};
