import { inject, injectable } from "inversify";
import { BlacklistedRefreshTokenModel } from "../../db/mongoose/models/blacklistedRefreshToken.model";
@injectable()
export class AuthCommandsRepository {
  constructor(
    @inject(BlacklistedRefreshTokenModel)
    private readonly blacklistedRefreshTokenModel: typeof BlacklistedRefreshTokenModel,
  ) {}
  async putRefreshTokenToBlacklist(
    token: string,
    userId: string,
  ): Promise<void> {
    await this.blacklistedRefreshTokenModel.create({
      userId,
      token,
    });
  }
}
