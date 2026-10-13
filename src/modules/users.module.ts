import { ContainerModule } from "inversify";
import { UsersController } from "../controllers/usersController";
import { UsersService } from "../service/usersService";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { UsersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { TYPES } from "../constants/tokens";
import { createEmailManager } from "../globals/email/email-manager";

export const UsersModule = new ContainerModule((options) => {
  options.bind<UsersController>(UsersController).to(UsersController);
  options.bind<UsersService>(UsersService).to(UsersService);
  options
    .bind<UsersQueryRepository>(UsersQueryRepository)
    .to(UsersQueryRepository);
  options
    .bind<UsersCommandsRepository>(UsersCommandsRepository)
    .to(UsersCommandsRepository);
  options.bind(TYPES.EmailManager).toDynamicValue((context) => {
    const usersCommandsRepository = context.get<UsersCommandsRepository>(
      UsersCommandsRepository,
    );
    const usersQueryRepository =
      context.get<UsersQueryRepository>(UsersQueryRepository);

    return createEmailManager({
      usersCommandsRepository,
      usersQueryRepository,
    });
  });
});
