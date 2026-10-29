import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { BlacklistedRefreshTokenModel } from "../../db/mongoose/models/blacklistedRefreshToken.model";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";

@injectable()
export class AuthQueryRepository {
  constructor(
    @inject(BlacklistedRefreshTokenModel)
    private readonly blacklistedRefreshTokenModel: Model<RefreshTokensBlacklistDB>,
  ) {}
  async findBlacklistedRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokensBlacklistDB | null> {
    const foundRefreshToken = await this.blacklistedRefreshTokenModel
      .findOne({
        userId,
        token: refreshToken,
      })
      .lean();
    return foundRefreshToken;
  }
}
