import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { mongoDB } from "../db";
export const testingRouter = express.Router({});

//TODO REMOVE ALL COURSES
testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  const collections = await mongoDB.collections();

  // 1. Gather all individual collection clearing tasks
  const deletionPromises = collections.map((collection) =>
    collection.deleteMany({}),
  );

  // 2. Wait until MongoDB has finished purging every table
  await Promise.all(deletionPromises);

  // 3. FIX: Use .status().send() to ensure an entirely empty, valid 204 response body
  return res.sendStatus(StatusCodes.NO_CONTENT);
});
