import { jwtService } from "../../application/jwt-service";

export const create_access_refresh_tokens = async (userId: string) => {
  const accessToken = await jwtService.createJWT(
    userId,
    process.env.ACCESS_TOKEN_SECRET as string,
    30
  );
  const refreshToken = await jwtService.createJWT(
    userId,
    process.env.REFRESH_TOKEN_SECRET as string,
    1800
  );
  return {
    accessToken,
    refreshToken,
  };
};
