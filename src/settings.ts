import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { videosRouter } from "./routers/video-router";

export const app = express();
app.use(express.json());

app.get("/", () => {
  console.log("hello");
});

app.use("/api/videos", videosRouter);
