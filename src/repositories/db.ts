import { MongoClient } from "mongodb";
require("dotenv").config();
const mongoUri = process.env.MONGO_URL || "mongodb://localhost:27017";
console.log("mongoURL:", process.env.MONGO_URL);

export const client = new MongoClient(mongoUri);

export const runDB = async () => {
  try {
    //Connect the client to the server
    await client.connect();
    console.log("Connected successfully to mongo server");
    await client.db("admin").command({ ping: 1 });
  } catch (e) {
    //Ensures that the client will close when you finish/error
    console.log("Can't connect to DB: ", e);
    await client.close();
  }
};
