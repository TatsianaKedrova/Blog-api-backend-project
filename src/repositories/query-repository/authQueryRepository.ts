import { ObjectId } from 'mongodb';
import { refreshTokensBlacklistedCollection } from '../../db';
export const authQueryRepository = {
    async findBlacklistedUserRefreshTokenById(
        userId: ObjectId,
        refreshToken: string
      ) {
        const foundRefreshToken = await refreshTokensBlacklistedCollection.findOne({
          _id: userId,
          refreshTokensArray: refreshToken,
        });
        return foundRefreshToken;
      },
}