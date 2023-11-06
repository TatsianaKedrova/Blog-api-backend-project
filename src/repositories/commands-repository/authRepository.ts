import { RefreshTokenDB } from "./../../dto/authDTO/authDTO";
import { refreshTokensBlacklistedCollection } from "../../db";

export const authCommandsRepository = {
  async placeTokenToBlacklist(
    refreshTokenSchema: RefreshTokenDB
  ): Promise<RefreshTokenDB> {
    const result = await refreshTokensBlacklistedCollection.insertOne(
      refreshTokenSchema
    );
    console.log("result: ", result);
    return refreshTokenSchema;
  },
};
