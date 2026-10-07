import { UsersController } from "./controllers/usersController";
import { UsersCommandsRepository } from "./repositories/commands-repository/usersCommandsRepository";
import { UsersQueryRepository } from "./repositories/query-repository/usersQueryRepository";
import { AuthService } from "./service/authService";
import { UsersService } from "./service/usersService";

//Repositories
const usersQueryRepository = new UsersQueryRepository();
const usersCommandsRepository = new UsersCommandsRepository(
  usersQueryRepository,
);

//Services
const authService = new AuthService();
const usersService = new UsersService(
  usersQueryRepository,
  usersCommandsRepository,
  authService,
);
//Controllers
export const usersController = new UsersController(
  usersService,
  usersQueryRepository,
);
