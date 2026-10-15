import { ContainerModule } from "inversify";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../service/authService";
import { AuthQueryRepository } from "../repositories/query-repository/authQueryRepository";
import { AuthCommandsRepository } from "../repositories/commands-repository/authCommandsRepository";
import { TYPES } from "../constants/tokens";
import { SecurityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";
import { createRefreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";
import { ApiCallsService } from "../service/apiCallsService";
import { createRateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware";

export const AuthModule = new ContainerModule((options) => {
  options.bind<AuthController>(AuthController).toSelf().inSingletonScope();
  options.bind<AuthService>(AuthService).toSelf().inSingletonScope();
  options
    .bind<AuthQueryRepository>(AuthQueryRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<AuthCommandsRepository>(AuthCommandsRepository)
    .toSelf()
    .inSingletonScope();
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
    })
    .inSingletonScope();
  options
    .bind(TYPES.RateLimiterMiddleware)
    .toDynamicValue((context) => {
      const apiCallsService = context.get<ApiCallsService>(ApiCallsService);
      return createRateLimiterMiddleware(apiCallsService);
    })
    .inSingletonScope();
});


