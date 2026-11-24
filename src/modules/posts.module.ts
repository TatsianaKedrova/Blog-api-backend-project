import { ContainerModule } from "inversify";
import { PostsController } from "../controllers/postsController";
import { PostsService } from "../service/postsService";
import { PostsQueryRepository } from "../repositories/query-repository/postsQueryRepository";
import { PostsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { TYPES } from "../constants/tokens";
import { PostModel } from "../db/mongoose/models/post.model";

export const PostsModule = new ContainerModule((options) => {
  options.bind<PostsController>(PostsController).toSelf().inSingletonScope();
  options.bind<PostsService>(PostsService).toSelf().inSingletonScope();
  options
    .bind<PostsQueryRepository>(PostsQueryRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<PostsCommandsRepository>(PostsCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options.bind(TYPES.PostModel).toConstantValue(PostModel);
});
