import express from "express";
import { StatusCodes } from "http-status-codes";
import { TDataBase, db } from "../temporal-database/project-db";
export const testingRouter = express.Router({});

//TODO REMOVE ALL COURSES
testingRouter.delete("/all-data", (req, res) => {
  Object.keys(db).forEach((database) => {
    db[database as keyof TDataBase] = [];
  });
  res.sendStatus(StatusCodes.NO_CONTENT);
});
