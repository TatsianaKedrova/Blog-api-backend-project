import { ContainerModule } from "inversify";
import { CommentsController } from "../controllers/commentsController";
import { CommentsService } from "../service/commentsService";
import { CommentsQueryRepository } from "../repositories/query-repository/commentsQueryRepository";
import { CommentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { TYPES } from "../constants/tokens";
import { createForbiddenResponseMiddleware } from "../middlewares/forbiddenResponseMiddleware";
export const CommentsModule = new ContainerModule((options) => {
  options
    .bind<CommentsController>(CommentsController)
    .toSelf()
    .inSingletonScope();
  options.bind<CommentsService>(CommentsService).toSelf().inSingletonScope();
  options
    .bind<CommentsQueryRepository>(CommentsQueryRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<CommentsCommandsRepository>(CommentsCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind(TYPES.ForbiddenResponseMiddleware)
    .toDynamicValue((context) => {
      const commentsQueryRepository = context.get<CommentsQueryRepository>(
        CommentsQueryRepository,
      );
      return createForbiddenResponseMiddleware(commentsQueryRepository);
    })
    .inSingletonScope();
});
