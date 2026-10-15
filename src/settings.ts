import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { httpMethodsCheckMiddleware } from "./middlewares/httpMethodsCheckMiddleware";
import { createAppError } from "./utils/appErrors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { testingRouter } from "./routers/testing-router";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { commentsRouter } from "./routers/comments-router";
import { securityDevicesRouter } from "./routers/securityDevices-router";
import { usersRouter } from "./routers/usersRouter";
import { authRouter } from "./routers/authRouter";

export const app = express();

app.use(morgan("dev"));
app.use(httpMethodsCheckMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/testing", testingRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/security/devices", securityDevicesRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// 6. Global Post-routing Handling (Fallback 404 & Global Errors)
app.use((req: Request, res: Response, next: NextFunction) => {
  throw createAppError(
    "The requested API endpoint does not exist",
    StatusCodes.NOT_FOUND,
  );
});
app.use(globalErrorHandler);
