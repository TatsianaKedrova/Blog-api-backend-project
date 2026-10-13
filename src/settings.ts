import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import "./composition-route";

import { testingRouter } from "./routers/testing-router";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { authRouter } from "./routers/auth-router";
import { commentsRouter } from "./routers/comments-router";
import { securityDevicesRouter } from "./routers/securityDevices-router";

import { httpMethodsCheckMiddleware } from "./middlewares/httpMethodsCheckMiddleware";
import { createAppError } from "./utils/appErrors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { UsersModule } from "./modules/users.module";
import { AuthModule } from "./modules/auth.module";

const container = new Container();
container.load(UsersModule);
container.load(AuthModule);
const server = new InversifyExpressServer(container, null, {
  rootPath: "/api",
});

//WE configure here global middlewares
server.setConfig((expressApp) => {
  expressApp.use(morgan("dev"));
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(httpMethodsCheckMiddleware);
  expressApp.use(cookieParser());

  expressApp.use("/api/testing", testingRouter);
  expressApp.use("/api/blogs", blogsRouter);
  expressApp.use("/api/posts", postsRouter);
  expressApp.use("/api/auth", authRouter);
  expressApp.use("/api/comments", commentsRouter);
  expressApp.use("/api/security/devices", securityDevicesRouter);
});

server.setErrorConfig((expressApp) => {
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    throw createAppError(
      "The requested API endpoint does not exist",
      StatusCodes.NOT_FOUND,
    );
  });

  //The Global Error Handler
  expressApp.use(globalErrorHandler);
});

export const app = server.build();
