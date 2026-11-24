import { ContainerModule } from "inversify";
import { BlogsController } from "../controllers/blogsController";
import { BlogsService } from "../service/blogsService";
import { BlogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { BlogsCommandsRepository } from "../repositories/commands-repository/blogsCommandsRepository";
import { TYPES } from "../constants/tokens";
import { BlogModel } from "../db/mongoose/models/blog.model";

export const BlogsModule = new ContainerModule((options) => {
  options.bind<BlogsController>(BlogsController).toSelf().inSingletonScope();
  options.bind<BlogsService>(BlogsService).toSelf().inSingletonScope();
  options
    .bind<BlogsQueryRepository>(BlogsQueryRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<BlogsCommandsRepository>(BlogsCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options.bind(TYPES.BlogModel).toConstantValue(BlogModel);
});
