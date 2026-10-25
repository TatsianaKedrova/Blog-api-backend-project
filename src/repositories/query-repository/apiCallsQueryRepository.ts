import { injectable } from "inversify";
import { ApiCallModel } from "../../db/mongoose/models/apiCalls.model";

@injectable()
export class ApiCallsQueryRepository {
  async countApiCalls(
    ip: string,
    url: string,
    timeLimit: Date,
  ): Promise<number> {
    return await ApiCallModel.countDocuments({
      ip: ip,
      url: url,
      date: { $gte: timeLimit },
    });
  }
}
