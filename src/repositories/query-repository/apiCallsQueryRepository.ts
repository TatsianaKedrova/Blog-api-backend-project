import { apiCallsCollection } from "../../db";

class ApiQueryRepository {
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

export const apiCallsQueryRepository = new ApiQueryRepository();
