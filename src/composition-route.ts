import { AuthController } from "./controllers/authController";
import { SecurityDevicesController } from "./controllers/securityDevicesController";
import { UsersController } from "./controllers/usersController";
import { createEmailManager } from "./globals/email/email-manager";
import { AuthCommandsRepository } from "./repositories/commands-repository/authCommandsRepository";
import { SecurityDevicesCommandsRepository } from "./repositories/commands-repository/securityDevicesCommandsRepository";
import { UsersCommandsRepository } from "./repositories/commands-repository/usersCommandsRepository";
import { AuthQueryRepository } from "./repositories/query-repository/authQueryRepository";
import { SecurityDevicesQueryRepository } from "./repositories/query-repository/securityDevicesQueryRepository";
import { UsersQueryRepository } from "./repositories/query-repository/usersQueryRepository";
import { AuthService } from "./service/authService";
import { SecurityDevicesService } from "./service/securityDevicesService";
import { UsersService } from "./service/usersService";

//Repositories
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

//Services
//security devices
const securityDevicesService = new SecurityDevicesService(
  securityDevicesCommandsRepository,
);
//auth
const authService = new AuthService(
  authCommandsRepository,
  usersCommandsRepository,
  usersQueryRepository,
  securityDevicesService,
);
//users
const usersService = new UsersService(
  usersQueryRepository,
  usersCommandsRepository,
  authService,
);

//Controllers
//users
export const usersController = new UsersController(
  usersService,
  usersQueryRepository,
);
//security devices
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

//global utility functions
export const emailManager = createEmailManager({
  usersCommandsRepository,
  usersQueryRepository,
});
