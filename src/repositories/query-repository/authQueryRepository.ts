import { ObjectId, WithId } from "mongodb";
import { refreshTokensBlacklistedCollection } from "../../db";
import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";

class AuthQueryRepository {
  async findBlacklistedUserRefreshTokenById(
    userId: ObjectId,
    refreshToken: string,
  ): Promise<null | WithId<RefreshTokensBlacklistDB>> {
    const foundRefreshToken = await refreshTokensBlacklistedCollection.findOne({
      _id: userId,
      refreshTokensArray: refreshToken,
    });
    return foundRefreshToken;
  }
}

export const authQueryRepository = new AuthQueryRepository();
