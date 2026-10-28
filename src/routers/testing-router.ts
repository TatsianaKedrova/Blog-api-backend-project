import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
export const testingRouter = express.Router({});

//TODO REMOVE ALL COURSES
testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established yet.");
  }
  const collections = await db.listCollections().toArray();

  // 1. Gather all individual collection clearing tasks
  const deletionPromises = collections.map((collection) =>
    db.collection(collection.name).deleteMany({}),
  );

  // 2. Wait until MongoDB has finished purging every table
  await Promise.all(deletionPromises);

  // 3. FIX: Use .status().send() to ensure an entirely empty, valid 204 response body
  return res.sendStatus(StatusCodes.NO_CONTENT);
});
