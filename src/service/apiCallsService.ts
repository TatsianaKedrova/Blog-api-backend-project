import { inject, injectable } from "inversify";
import { ApiCallsDBType } from "../dto/apiCallsDTO/apiCallsDTO";
import { ApiCallsCommandsRepository } from "../repositories/commands-repository/apiCallsCommandsRepository";
import { ApiCallsQueryRepository } from "../repositories/query-repository/apiCallsQueryRepository";

@injectable()
export class ApiCallsService {
  constructor(
    @inject(ApiCallsQueryRepository)
    protected readonly apiCallsQueryRepository: ApiCallsQueryRepository,
    @inject(ApiCallsCommandsRepository)
    protected readonly apiCallsCommandsRepository: ApiCallsCommandsRepository,
  ) {}
  async checkIpRequestCount(url: string, ip: string): Promise<boolean> {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
    const normalizedUrl = url.replace(/\/$/, "");
    const existingApiCalls = await this.apiCallsQueryRepository.countApiCalls(
      ip,
      normalizedUrl,
      tenSecondsAgo,
    );

    if (existingApiCalls >= 5) {
      return false;
    }
    const apiCallsObject = new ApiCallsDBType(ip, normalizedUrl, now);
    await this.apiCallsCommandsRepository.addApiCall(apiCallsObject);
    return true;
  }
}
