import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { BlacklistedRefreshTokenModel } from "../../db/mongoose/models/blacklistedRefreshToken.model";

export class AuthQueryRepository {
  async findBlacklistedRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokensBlacklistDB | null> {
    const foundRefreshToken = await BlacklistedRefreshTokenModel.findOne({
      userId,
      token: refreshToken,
    }).lean();
    return foundRefreshToken;
  }
}
