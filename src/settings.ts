import express from "express";
import { videosRouter } from "./routers/video-router";
import { testingRouter } from "./routers/testing-router";

export const app = express();
app.use(express.json());

app.use("/api/videos", videosRouter);
app.use("/api/testing", testingRouter);
