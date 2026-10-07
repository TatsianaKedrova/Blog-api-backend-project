import { ApiCallsDBType } from "../dto/apiCallsDTO/apiCallsDTO";
import { ApiCallsCommandsRepository } from "../repositories/commands-repository/apiCallsCommandsRepository";
import { ApiCallsQueryRepository } from "../repositories/query-repository/apiCallsQueryRepository";

export class ApiCallsService {
  constructor(
    protected readonly apiCallsQueryRepository: ApiCallsQueryRepository,
    protected readonly apiCallsCommandsRepository: ApiCallsCommandsRepository,
  ) {}
  async checkIpRequestCount(url: string, ip: string): Promise<boolean> {
    const now = new Date();
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const normalizedUrl = url.replace(/\/$/, "");
    const existingApiCalls = await this.apiCallsQueryRepository.countApiCalls(
      ip,
      normalizedUrl,
      tenSecondsAgo,
    );

    if (existingApiCalls >= 5) {
      return false;
    }
    const apiCallsObject = new ApiCallsDBType(ip, url, now);
    await this.apiCallsCommandsRepository.addApiCall(apiCallsObject);
    return true;
  }
}
