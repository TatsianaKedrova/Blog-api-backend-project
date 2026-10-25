import { ObjectId, WithId } from "mongodb";
import { RefreshTokensBlacklistDB } from "../../dto/authDTO/authDTO";
import { refreshTokensBlacklistedCollection } from "../../db/mongoDB/mongoDB";

export class AuthQueryRepository {
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
