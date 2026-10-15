import { RequestHandler } from "express";
import { Container } from "inversify";
import { UsersModule } from "./modules/users.module";
import { AuthModule } from "./modules/auth.module";
import { SecurityDevicesModule } from "./modules/securityDevices.module";
import { UsersController } from "./controllers/usersController";
import { AuthController } from "./controllers/authController";
import { SecurityDevicesController } from "./controllers/securityDevicesController";
import { TYPES } from "./constants/tokens";
import { ApiCallsModule } from "./modules/apiCalls.module";
import { PostsModule } from "./modules/posts.module";
import { PostsController } from "./controllers/postsController";
import { BlogsModule } from "./modules/blogs.module";
import { BlogsController } from "./controllers/blogsController";
import { CommentsController } from "./controllers/commentsController";
import { CommentsModule } from "./modules/comments.module";

const container = new Container();
container.load(
  UsersModule,
  AuthModule,
  SecurityDevicesModule,
  ApiCallsModule,
  PostsModule,
  BlogsModule,
  CommentsModule,
);

export const usersController = container.get<UsersController>(UsersController);
export const authController = container.get<AuthController>(AuthController);
export const securityDevicesController =
  container.get<SecurityDevicesController>(SecurityDevicesController);
export const postsController = container.get<PostsController>(PostsController);
export const blogsController = container.get<BlogsController>(BlogsController);
export const commentsController =
  container.get<CommentsController>(CommentsController);
export const rateLimiterMiddleware = container.get<RequestHandler>(
  TYPES.RateLimiterMiddleware,
);
export const refreshTokenValidityMiddleware = container.get<RequestHandler>(
  TYPES.RefreshTokenValidityMiddleware,
);
export const forbiddenResponseMiddleware = container.get<RequestHandler>(
  TYPES.ForbiddenResponseMiddleware,
);
