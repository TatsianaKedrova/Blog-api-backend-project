import { apiCallsCollection } from "../../db";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";

export const apiCallsCommandsRepository = {
  async addApiCall(apiCall: ApiCallsDBType): Promise<boolean> {
    const result = await apiCallsCollection.insertOne(apiCall);
    return result.acknowledged;
  },
};
