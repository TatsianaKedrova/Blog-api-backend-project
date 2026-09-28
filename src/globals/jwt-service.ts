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

export const jwtService = {
  async createJWT(
    payload: AccessTokenPayloadType | RefreshTokenPayloadType,
    secret: string,
    expiresIn: number,
  ): Promise<string> {
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
    return token;
  },
  async createAccessRefreshTokensResponse(
    userId: string,
    deviceId: string,
  ): Promise<TokenPairResponse> {
    const accessToken = await jwtService.createJWT(
      { userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      100,
    );
    const refreshToken = await jwtService.createJWT(
      { userId, deviceId },
      process.env.REFRESH_TOKEN_SECRET as string,
      2000,
    );
    return {
      accessToken: accessToken as AccessToken,
      refreshToken: refreshToken as RefreshToken,
    };
  },
  async getJwtPayloadResult(
    token: string,
    secret: string,
  ): Promise<JwtPayloadResult | null> {
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
  },
  async getTokenCreationDate(token: string): Promise<Date> {
    const decoded = jwt.decode(token) as JwtPayload;
    const creationTimestamp = decoded.iat;
    const refreshTokenCreationDate = new Date(creationTimestamp! * 1000);
    return refreshTokenCreationDate;
  },
};
