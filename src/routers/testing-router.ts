import express from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../temporal-database/videos-db";
export const testingRouter = express.Router({});

//TODO REMOVE ALL COURSES
testingRouter.delete("/all-data", (req, res) => {
    db.videos = [];
    res.sendStatus(StatusCodes.NO_CONTENT);
  });