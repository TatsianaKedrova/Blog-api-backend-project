import { AuthController } from "./controllers/authController";
import { SecurityDevicesController } from "./controllers/securityDevicesController";
import { UsersController } from "./controllers/usersController";
import { createEmailManager } from "./globals/email/email-manager";
import { createRefreshTokenValidityMiddleware } from "./middlewares/refreshTokenValidityMiddleware";
import { AuthCommandsRepository } from "./repositories/commands-repository/authCommandsRepository";
import { SecurityDevicesCommandsRepository } from "./repositories/commands-repository/securityDevicesCommandsRepository";
import { UsersCommandsRepository } from "./repositories/commands-repository/usersCommandsRepository";
import { AuthQueryRepository } from "./repositories/query-repository/authQueryRepository";
import { SecurityDevicesQueryRepository } from "./repositories/query-repository/securityDevicesQueryRepository";
import { UsersQueryRepository } from "./repositories/query-repository/usersQueryRepository";
import { AuthService } from "./service/authService";
import { SecurityDevicesService } from "./service/securityDevicesService";
import { UsersService } from "./service/usersService";

// ==========================================
// 1. Repositories
// ==========================================
//auth
const authCommandsRepository = new AuthCommandsRepository();
const authQueryRepository = new AuthQueryRepository();

//users
const usersQueryRepository = new UsersQueryRepository();
const usersCommandsRepository = new UsersCommandsRepository(
  usersQueryRepository,
);
//securityDevices
const securityDevicesQueryRepository = new SecurityDevicesQueryRepository();
const securityDevicesCommandsRepository =
  new SecurityDevicesCommandsRepository();

// ==========================================
// 2. Services
// ==========================================
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
