import { apiCallsCollection } from "../../db";
import { ApiCalls } from "../../dto/securityDevicesDTO/securityDevicesDTO";

export const apiCallsCommandsRepository = {
  async addApiCall(apiCall: ApiCalls): Promise<boolean> {
    const result = await apiCallsCollection.insertOne(apiCall);
    return result.acknowledged;
  },
};
