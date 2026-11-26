import { ContainerModule } from "inversify";
import { CommentsController } from "../controllers/commentsController";
import { CommentsService } from "../service/commentsService";
import { CommentsQueryRepository } from "../repositories/query-repository/commentsQueryRepository";
import { CommentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { TYPES } from "../constants/tokens";
import { createForbiddenResponseMiddleware } from "../middlewares/forbiddenResponseMiddleware";
import { CommentModel } from "../db/mongoose/models/comments.model";
import { LikeDislikeModel } from "../db/mongoose/models/likes.model";
import { LikesCommandsRepository } from "../repositories/commands-repository/likesCommandsRepository";
import { LikesQueryRepository } from "../repositories/query-repository/likesQueryRepository";
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
  options.bind(TYPES.CommentModel).toConstantValue(CommentModel);
  options.bind(TYPES.LikeDislikeModel).toConstantValue(LikeDislikeModel);
  options
    .bind<LikesCommandsRepository>(LikesCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<LikesQueryRepository>(LikesQueryRepository)
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
