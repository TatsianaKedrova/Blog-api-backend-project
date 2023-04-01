import express, { Request, Response } from "express";
import { videosRouter } from "./routers/video-router";

export const app = express();
app.use(express.json());

app.use("/api/videos", videosRouter);
