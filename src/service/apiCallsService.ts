import { ApiCalls } from "../dto/securityDevicesDTO/securityDevicesDTO";
import { apiCallsCommandsRepository } from "../repositories/commands-repository/apiCallsCommandsRepository";
import { apiCallsQueryRepository } from "../repositories/query-repository/apiCallsQueryRepository";

export const apiCallsService = {
  async checkIpRequestCount(url: string, ip: string): Promise<boolean> {
    const now = new Date();
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const apiCallsObject: ApiCalls = {
      url,
      ip,
      date: now,
    };
    await apiCallsCommandsRepository.addApiCall(apiCallsObject);
    const totalApiCalls = await apiCallsQueryRepository.countApiCalls(
      ip,
      url,
      tenSecondsAgo,
    );

    return totalApiCalls <= 5;
  },
};
