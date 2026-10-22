import { injectable } from "inversify";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";
import { apiCallsCollection } from "../../db/nativeMongoDB/mongoDB";

@injectable()
export class ApiCallsCommandsRepository {
  async addApiCall(apiCall: ApiCallsDBType): Promise<boolean> {
    const result = await apiCallsCollection.insertOne(apiCall);
    return result.acknowledged;
  }
}
