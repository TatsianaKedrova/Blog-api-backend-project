import { apiCallsCollection } from "../../db";

export class ApiCallsQueryRepository {
  async countApiCalls(
    ip: string,
    url: string,
    timeLimit: Date,
  ): Promise<number> {
    const result = await apiCallsCollection
      .find({
        ip: ip,
        url: url,
        date: { $gte: timeLimit },
      })
      .toArray();
    return result.length;
  }
}
