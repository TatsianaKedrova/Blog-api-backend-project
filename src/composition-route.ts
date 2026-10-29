import { AuthController } from "./controllers/authController";
import { BlogsController } from "./controllers/blogsController";
import { CommentsController } from "./controllers/commentsController";
import { PostsController } from "./controllers/postsController";
import { SecurityDevicesController } from "./controllers/securityDevicesController";
import { UsersController } from "./controllers/usersController";
import { ApiCallModel } from "./db/mongoose/models/apiCalls.model";
import { BlacklistedRefreshTokenModel } from "./db/mongoose/models/blacklistedRefreshToken.model";
import { BlogModel } from "./db/mongoose/models/blog.model";
import { CommentModel } from "./db/mongoose/models/comments.model";
import { PostModel } from "./db/mongoose/models/post.model";
import { SecurityDeviceModel } from "./db/mongoose/models/sessions.model";
import { UserModel } from "./db/mongoose/models/user.model";
import { createEmailManager } from "./globals/email/email-manager";
import { createForbiddenResponseMiddleware } from "./middlewares/forbiddenResponseMiddleware";
import { createRateLimiterMiddleware } from "./middlewares/rateLimiterMiddleware";
import { createRefreshTokenValidityMiddleware } from "./middlewares/refreshTokenValidityMiddleware";
import { ApiCallsCommandsRepository } from "./repositories/commands-repository/apiCallsCommandsRepository";
import { AuthCommandsRepository } from "./repositories/commands-repository/authCommandsRepository";
import { BlogsCommandsRepository } from "./repositories/commands-repository/blogsCommandsRepository";
import { CommentsCommandsRepository } from "./repositories/commands-repository/commentsCommandsRepository";
import { PostsCommandsRepository } from "./repositories/commands-repository/postsCommandsRepository";
import { SecurityDevicesCommandsRepository } from "./repositories/commands-repository/securityDevicesCommandsRepository";
import { UsersCommandsRepository } from "./repositories/commands-repository/usersCommandsRepository";
import { ApiCallsQueryRepository } from "./repositories/query-repository/apiCallsQueryRepository";
import { AuthQueryRepository } from "./repositories/query-repository/authQueryRepository";
import { BlogsQueryRepository } from "./repositories/query-repository/blogsQueryRepository";
import { CommentsQueryRepository } from "./repositories/query-repository/commentsQueryRepository";
import { PostsQueryRepository } from "./repositories/query-repository/postsQueryRepository";
import { SecurityDevicesQueryRepository } from "./repositories/query-repository/securityDevicesQueryRepository";
import { UsersQueryRepository } from "./repositories/query-repository/usersQueryRepository";
import { ApiCallsService } from "./service/apiCallsService";
import { AuthService } from "./service/authService";
import { BlogsService } from "./service/blogsService";
import { CommentsService } from "./service/commentsService";
import { PostsService } from "./service/postsService";
import { SecurityDevicesService } from "./service/securityDevicesService";
import { UsersService } from "./service/usersService";

// ==========================================
// 1. Repositories
// ==========================================
const apiCallsQueryRepository = new ApiCallsQueryRepository(ApiCallModel);
const apiCallsCommandsRepository = new ApiCallsCommandsRepository(ApiCallModel);
const authCommandsRepository = new AuthCommandsRepository(
  BlacklistedRefreshTokenModel,
);
const authQueryRepository = new AuthQueryRepository(
  BlacklistedRefreshTokenModel,
);
const usersQueryRepository = new UsersQueryRepository(UserModel);
const usersCommandsRepository = new UsersCommandsRepository(UserModel);
const securityDevicesQueryRepository = new SecurityDevicesQueryRepository(
  SecurityDeviceModel,
);
const securityDevicesCommandsRepository = new SecurityDevicesCommandsRepository(
  SecurityDeviceModel,
);
const blogsQueryRepository = new BlogsQueryRepository(PostModel, BlogModel);
const blogsCommandsRepository = new BlogsCommandsRepository(BlogModel);
const postsCommandsRepository = new PostsCommandsRepository(PostModel);
const postsQueryRepository = new PostsQueryRepository(PostModel);
const commentsQueryRepository = new CommentsQueryRepository(CommentModel);
const commentsCommandsRepository = new CommentsCommandsRepository(CommentModel);

// ==========================================
// 2. Services
// ==========================================
const apiCallsService = new ApiCallsService(
  apiCallsQueryRepository,
  apiCallsCommandsRepository,
);
const securityDevicesService = new SecurityDevicesService(
  securityDevicesCommandsRepository,
);
export const emailManager = createEmailManager({
  usersCommandsRepository,
  usersQueryRepository,
});
const authService = new AuthService(
  authCommandsRepository,
  usersCommandsRepository,
  usersQueryRepository,
  securityDevicesService,
  emailManager,
);

const usersService = new UsersService(
  usersQueryRepository,
  usersCommandsRepository,
  authService,
  emailManager,
);
const postsService = new PostsService(
  blogsQueryRepository,
  postsCommandsRepository,
);
const commentsService = new CommentsService(
  usersQueryRepository,
  postsQueryRepository,
  commentsCommandsRepository,
);

const blogsService = new BlogsService(blogsCommandsRepository);
// ==========================================
// 3. Middlewares / Global Utilities
// ==========================================

export const refreshTokenValidityMiddleware =
  createRefreshTokenValidityMiddleware({
    securityDevicesQueryRepository,
    authQueryRepository,
  });

export const rateLimiterMiddleware =
  createRateLimiterMiddleware(apiCallsService);

export const forbiddenResponseMiddleware = createForbiddenResponseMiddleware(
  commentsQueryRepository,
);

// ==========================================
// 4. Controllers
// ==========================================
export const usersController = new UsersController(
  usersService,
  usersQueryRepository,
);
export const securityDevicesController = new SecurityDevicesController(
  securityDevicesService,
  securityDevicesQueryRepository,
);
export const authController = new AuthController(
  usersQueryRepository,
  usersService,
  authService,
  securityDevicesService,
);

export const postsController = new PostsController(
  postsService,
  postsQueryRepository,
);
export const commentsController = new CommentsController(
  commentsService,
  commentsQueryRepository,
  postsQueryRepository,
);

export const blogsController = new BlogsController(
  blogsService,
  blogsQueryRepository,
);
