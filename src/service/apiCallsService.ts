import { ApiCallsDBType } from "../dto/apiCallsDTO/apiCallsDTO";
import { apiCallsCommandsRepository } from "../repositories/commands-repository/apiCallsCommandsRepository";
import { apiCallsQueryRepository } from "../repositories/query-repository/apiCallsQueryRepository";

class ApiCallsService {
  async checkIpRequestCount(url: string, ip: string): Promise<boolean> {
    const now = new Date();
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const normalizedUrl = url.replace(/\/$/, "");
    const existingApiCalls = await apiCallsQueryRepository.countApiCalls(
      ip,
      normalizedUrl,
      tenSecondsAgo,
    );

    if (existingApiCalls >= 5) {
      return false;
    }
    const apiCallsObject = new ApiCallsDBType(ip, url, now);
    await apiCallsCommandsRepository.addApiCall(apiCallsObject);
    return true;
  }
}

export const apiCallsService = new ApiCallsService();
