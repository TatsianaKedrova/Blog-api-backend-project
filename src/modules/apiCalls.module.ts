import { ContainerModule } from "inversify";
import { ApiCallsService } from "../service/apiCallsService";
import { ApiCallsQueryRepository } from "../repositories/query-repository/apiCallsQueryRepository";
import { ApiCallsCommandsRepository } from "../repositories/commands-repository/apiCallsCommandsRepository";
import { TYPES } from "../constants/tokens";
import { ApiCallModel } from "../db/mongoose/models/apiCalls.model";

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
  options.bind(TYPES.ApiCallModel).toConstantValue(ApiCallModel);
});
