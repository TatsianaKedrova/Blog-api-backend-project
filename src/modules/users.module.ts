import { ContainerModule } from "inversify";
import { UsersController } from "../controllers/usersController";
import { UsersService } from "../service/usersService";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { UsersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { TYPES } from "../constants/tokens";
import { createEmailManager } from "../globals/email/email-manager";

export const UsersModule = new ContainerModule((options) => {
  options.bind<UsersController>(UsersController).toSelf().inSingletonScope();
  options.bind<UsersService>(UsersService).toSelf().inSingletonScope();
  options
    .bind<UsersQueryRepository>(UsersQueryRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<UsersCommandsRepository>(UsersCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind(TYPES.EmailManager)
    .toDynamicValue((context) => {
      const usersCommandsRepository = context.get<UsersCommandsRepository>(
        UsersCommandsRepository,
      );
      const usersQueryRepository =
        context.get<UsersQueryRepository>(UsersQueryRepository);

      return createEmailManager({
        usersCommandsRepository,
        usersQueryRepository,
      });
    })
    .inSingletonScope();
});
