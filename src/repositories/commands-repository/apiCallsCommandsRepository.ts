import { inject, injectable } from "inversify";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";
import { ApiCallModel } from "../../db/mongoose/models/apiCalls.model";
import { TYPES } from "../../constants/tokens";

@injectable()
export class ApiCallsCommandsRepository {
  constructor(
    @inject(TYPES.ApiCallModel)
    private readonly apiCallModel: typeof ApiCallModel,
  ) {}
  async addApiCall(apiCall: Omit<ApiCallsDBType, "_id">): Promise<void> {
    await this.apiCallModel.create(apiCall);
  }
}
