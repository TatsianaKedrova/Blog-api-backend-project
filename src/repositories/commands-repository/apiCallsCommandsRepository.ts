import { apiCallsCollection } from "../../db";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";

class ApiCallsCommandsRepository {
  async addApiCall(apiCall: ApiCallsDBType): Promise<boolean> {
    const result = await apiCallsCollection.insertOne(apiCall);
    return result.acknowledged;
  }
}

export const apiCallsCommandsRepository = new ApiCallsCommandsRepository();
