import express from "express";
import { videosRouter } from "./routers/video-router";
import { testingRouter } from "./routers/testing-router";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";

export const app = express();
app.use(express.json());

app.use("/api/videos", videosRouter);
app.use("/api/testing", testingRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/posts", postsRouter);
