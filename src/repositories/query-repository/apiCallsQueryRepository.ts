import { inject, injectable } from "inversify";
import { ApiCallModel } from "../../db/mongoose/models/apiCalls.model";
import { Model } from "mongoose";
import { ApiCallsDBType } from "../../dto/apiCallsDTO/apiCallsDTO";

@injectable()
export class ApiCallsQueryRepository {
  constructor(
    @inject(ApiCallModel) private readonly apiCallModel: Model<ApiCallsDBType>,
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
