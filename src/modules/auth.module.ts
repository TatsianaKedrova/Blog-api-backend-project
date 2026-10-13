import { ContainerModule } from "inversify";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../service/authService";
import { AuthQueryRepository } from "../repositories/query-repository/authQueryRepository";
import { AuthCommandsRepository } from "../repositories/commands-repository/authCommandsRepository";

export const AuthModule = new ContainerModule((options) => {
  options.bind<AuthController>(AuthController).to(AuthController);
  options.bind<AuthService>(AuthService).to(AuthService);
  options
    .bind<AuthQueryRepository>(AuthQueryRepository)
    .to(AuthQueryRepository);
  options
    .bind<AuthCommandsRepository>(AuthCommandsRepository)
    .to(AuthCommandsRepository);
});
