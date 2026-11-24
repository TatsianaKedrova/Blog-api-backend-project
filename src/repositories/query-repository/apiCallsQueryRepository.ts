import { inject, injectable } from "inversify";
import { ApiCallModel } from "../../db/mongoose/models/apiCalls.model";
import { TYPES } from "../../constants/tokens";

@injectable()
export class ApiCallsQueryRepository {
  constructor(
    @inject(TYPES.ApiCallModel)
    private readonly apiCallModel: typeof ApiCallModel,
  ) {}
  async countApiCalls(
    ip: string,
    url: string,
    timeLimit: Date,
  ): Promise<number> {
    return await this.apiCallModel.countDocuments({
      ip: ip,
      url: url,
      date: { $gte: timeLimit },
    });
  }
}
