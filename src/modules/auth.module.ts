import { ContainerModule } from "inversify";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../service/authService";
import { AuthQueryRepository } from "../repositories/query-repository/authQueryRepository";
import { AuthCommandsRepository } from "../repositories/commands-repository/authCommandsRepository";
import { TYPES } from "../constants/tokens";
import { SecurityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";
import { createRefreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";

export const AuthModule = new ContainerModule((options) => {
  options.bind<AuthController>(AuthController).to(AuthController);
  options.bind<AuthService>(AuthService).to(AuthService);
  options
    .bind<AuthQueryRepository>(AuthQueryRepository)
    .to(AuthQueryRepository);
  options
    .bind<AuthCommandsRepository>(AuthCommandsRepository)
    .to(AuthCommandsRepository);
  options
    .bind(TYPES.RefreshTokenValidityMiddleware)
    .toDynamicValue((context) => {
      const securityDevicesQueryRepository =
        context.get<SecurityDevicesQueryRepository>(
          SecurityDevicesQueryRepository,
        );
      const authQueryRepository =
        context.get<AuthQueryRepository>(AuthQueryRepository);

      return createRefreshTokenValidityMiddleware({
        securityDevicesQueryRepository,
        authQueryRepository,
      });
    });
});
