import { ContainerModule } from "inversify";
import { ApiCallsService } from "../service/apiCallsService";
import { ApiCallsQueryRepository } from "../repositories/query-repository/apiCallsQueryRepository";
import { ApiCallsCommandsRepository } from "../repositories/commands-repository/apiCallsCommandsRepository";

export const ApiCallsModule = new ContainerModule((options) => {
  options.bind<ApiCallsService>(ApiCallsService).toSelf().inSingletonScope();
  options
    .bind<ApiCallsCommandsRepository>(ApiCallsCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<ApiCallsQueryRepository>(ApiCallsQueryRepository)
    .toSelf()
    .inSingletonScope();
});
