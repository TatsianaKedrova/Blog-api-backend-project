import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { BlacklistedRefreshTokenModel } from "../../db/mongoose/models/blacklistedRefreshToken.model";
import { inject, injectable } from "inversify";
import { TYPES } from "../../constants/tokens";

@injectable()
export class AuthQueryRepository {
  constructor(
    @inject(TYPES.BlacklistedRefreshTokenModel)
    private readonly blacklistedRefreshTokenModel: typeof BlacklistedRefreshTokenModel,
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
