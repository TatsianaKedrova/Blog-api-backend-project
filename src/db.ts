import { Db, MongoClient } from "mongodb";
import { PostViewModel } from "./dto/postsDTO/PostModel";
import dotenv from "dotenv";
import { BlogDBType } from "./dto/blogsDTO/BlogModel";
dotenv.config();
const mongoUri = process.env.MONGO_URL || "mongodb://localhost:27017";

const client: MongoClient = new MongoClient(mongoUri);
const dbName = "blogs-posts";
const mongoDB: Db = client.db(dbName);

export const blogsCollection = mongoDB.collection<BlogDBType>("blogs");
export const postsCollection = mongoDB.collection<PostViewModel[]>("posts");

export const runDB = async () => {
  try {
    //Connect the client to the server
    await client.connect();
    console.log("Connected successfully to mongo server");
    await mongoDB.command({ ping: 1 });
    console.log("Client connected");
  } catch (e) {
    //Ensures that the client will close when you finish/error
    console.log("Can't connect to DB: ", e);
    await client.close();
  }
};
