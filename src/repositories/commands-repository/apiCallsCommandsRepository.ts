import { injectable } from "inversify";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";
import { ApiCallsModel } from "../../db/mongoose/models/apiCalls.model";

@injectable()
export class ApiCallsCommandsRepository {
  async addApiCall(apiCall: Omit<ApiCallsDBType, "_id">): Promise<void> {
    await ApiCallsModel.create(apiCall);
  }
}
