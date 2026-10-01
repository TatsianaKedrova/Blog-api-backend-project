import { ObjectId } from "mongodb";
import { refreshTokensBlacklistedCollection } from "../../db";

class AuthCommandsRepository {
  async createUserRefreshTokensBlacklist(userId: ObjectId): Promise<string> {
    const createRefreshTokensBlacklistForUser =
      await refreshTokensBlacklistedCollection.insertOne({
        _id: userId,
        refreshTokensArray: [],
      });
    return createRefreshTokensBlacklistForUser.insertedId.toString();
  }
  async putRefreshTokenToBlacklist(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    await refreshTokensBlacklistedCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { refreshTokensArray: refreshToken } },
    );
  }
}

export const authCommandsRepository = new AuthCommandsRepository();
