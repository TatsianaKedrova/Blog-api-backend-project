import { jwtService } from "../../application/jwt-service";
import { createAccessTokenModel } from "./tokenModel";

export const create_access_refresh_tokens = async (userId: string) => {
  const accessToken = await jwtService.createJWT(
    userId,
    process.env.ACCESS_TOKEN_SECRET as string,
    100
  );
  const refreshToken = await jwtService.createJWT(
    userId,
    process.env.REFRESH_TOKEN_SECRET as string,
    200
  );
  const tokenModel = createAccessTokenModel(accessToken);
  return {
    accessTokenModel: tokenModel,
    refreshToken,
  };
};
