import express from "express";
import { videosRouter } from "./routers/video-router";
import { testingRouter } from "./routers/testing-router";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { authRouter } from "./routers/auth-router";
import { usersRouter } from "./routers/users-router";
import { commentsRouter } from "./routers/comments-router";
import cookieParser from "cookie-parser";

export const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/api/videos", videosRouter);
app.use("/api/testing", testingRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter)
