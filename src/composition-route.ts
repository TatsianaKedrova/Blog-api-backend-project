import { AuthController } from "./controllers/authController";
import { SecurityDevicesController } from "./controllers/securityDevicesController";
import { UsersController } from "./controllers/usersController";
import { createEmailManager } from "./globals/email/email-manager";
import { createRateLimiterMiddleware } from "./middlewares/rateLimiterMiddleware";
import { createRefreshTokenValidityMiddleware } from "./middlewares/refreshTokenValidityMiddleware";
import { ApiCallsCommandsRepository } from "./repositories/commands-repository/apiCallsCommandsRepository";
import { AuthCommandsRepository } from "./repositories/commands-repository/authCommandsRepository";
import { SecurityDevicesCommandsRepository } from "./repositories/commands-repository/securityDevicesCommandsRepository";
import { UsersCommandsRepository } from "./repositories/commands-repository/usersCommandsRepository";
import { ApiCallsQueryRepository } from "./repositories/query-repository/apiCallsQueryRepository";
import { AuthQueryRepository } from "./repositories/query-repository/authQueryRepository";
import { SecurityDevicesQueryRepository } from "./repositories/query-repository/securityDevicesQueryRepository";
import { UsersQueryRepository } from "./repositories/query-repository/usersQueryRepository";
import { ApiCallsService } from "./service/apiCallsService";
import { AuthService } from "./service/authService";
import { SecurityDevicesService } from "./service/securityDevicesService";
import { UsersService } from "./service/usersService";

// ==========================================
// 1. Repositories
// ==========================================
const apiCallsQueryRepository = new ApiCallsQueryRepository();
const apiCallsCommandsRepository = new ApiCallsCommandsRepository();
const authCommandsRepository = new AuthCommandsRepository();
const authQueryRepository = new AuthQueryRepository();
const usersQueryRepository = new UsersQueryRepository();
const usersCommandsRepository = new UsersCommandsRepository(
  usersQueryRepository,
);
const securityDevicesQueryRepository = new SecurityDevicesQueryRepository();
const securityDevicesCommandsRepository =
  new SecurityDevicesCommandsRepository();

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
const authService = new AuthService(
  authCommandsRepository,
  usersCommandsRepository,
  usersQueryRepository,
  securityDevicesService,
);
const usersService = new UsersService(
  usersQueryRepository,
  usersCommandsRepository,
  authService,
);

// ==========================================
// 3. Middlewares / Global Utilities
// ==========================================
export const emailManager = createEmailManager({
  usersCommandsRepository,
  usersQueryRepository,
});

export const refreshTokenValidityMiddleware =
  createRefreshTokenValidityMiddleware({
    securityDevicesQueryRepository,
    authQueryRepository,
  });

export const rateLimiterMiddleware =
  createRateLimiterMiddleware(apiCallsService);

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
