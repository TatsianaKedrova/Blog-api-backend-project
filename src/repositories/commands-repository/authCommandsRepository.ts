import { inject, injectable } from "inversify";
import { BlacklistedRefreshTokenModel } from "../../db/mongoose/models/blacklistedRefreshToken.model";
import { Model } from "mongoose";
import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
@injectable()
export class AuthCommandsRepository {
  constructor(
    @inject(BlacklistedRefreshTokenModel)
    private readonly blacklistedRefreshTokenModel: Model<RefreshTokensBlacklistDB>,
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
