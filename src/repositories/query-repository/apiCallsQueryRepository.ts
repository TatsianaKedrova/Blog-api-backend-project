import { injectable } from "inversify";
import { ApiCallsModel } from "../../db/mongoose/models/apiCalls.model";

@injectable()
export class ApiCallsQueryRepository {
  async countApiCalls(
    ip: string,
    url: string,
    timeLimit: Date,
  ): Promise<number> {
    return await ApiCallsModel.countDocuments({
      ip: ip,
      url: url,
      date: { $gte: timeLimit },
    });
  }
}
