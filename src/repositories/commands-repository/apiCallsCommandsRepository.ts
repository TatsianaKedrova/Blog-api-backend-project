import { inject, injectable } from "inversify";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";
import { ApiCallModel } from "../../db/mongoose/models/apiCalls.model";
import { Model } from "mongoose";

@injectable()
export class ApiCallsCommandsRepository {
  constructor(
    @inject(ApiCallModel) private readonly apiCallModel: Model<ApiCallsDBType>,
  ) {}
  async addApiCall(apiCall: Omit<ApiCallsDBType, "_id">): Promise<void> {
    await this.apiCallModel.create(apiCall);
  }
}
