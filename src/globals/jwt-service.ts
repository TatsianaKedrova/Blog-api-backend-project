import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { JwtPayloadResult } from "../dto/common/jwt/JwtPayloadResult";
import {
  AccessToken,
  AccessTokenPayloadType,
  RefreshToken,
  RefreshTokenPayloadType,
  TokenPairResponse,
} from "../dto/authDTO/authDTO";

export function createJWT(
  payload: AccessTokenPayloadType | RefreshTokenPayloadType,
  secret: string,
  expiresIn: number,
): string {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
}
export function createAccessRefreshTokensResponse(
  userId: string,
  deviceId: string,
): TokenPairResponse {
  const accessToken = createJWT(
    { userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    10,
  );
  const refreshToken = createJWT(
    { userId, deviceId },
    process.env.REFRESH_TOKEN_SECRET as string,
    20,
  );
  return {
    accessToken: accessToken as AccessToken,
    refreshToken: refreshToken as RefreshToken,
  };
}
export function getJwtPayloadResult(
  token: string,
  secret: string,
): JwtPayloadResult | null {
  try {
    const result = jwt.verify(token, secret);
    return result as JwtPayloadResult;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log({
        name: error.name,
        message: error.message,
        expiredAt: error.expiredAt,
      });
      return null;
    } else if (error instanceof JsonWebTokenError) {
      console.log({
        name: error.name,
        message: error.message,
      });
      return null;
    } else if (error instanceof NotBeforeError) {
      console.log({
        name: error.name,
        message: error.message,
      });
      return null;
    } else return null;
  }
}
export function getTokenCreationDate(token: string): Date {
  const decoded = jwt.decode(token) as JwtPayload;
  const creationTimestamp = decoded.iat;
  const refreshTokenCreationDate = new Date(creationTimestamp! * 1000);
  return refreshTokenCreationDate;
}
