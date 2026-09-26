import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { JwtPayloadResult } from "../dto/common/jwt/JwtPayloadResult";
import {
  AccessTokenPayloadType,
  RefreshTokenPayloadType,
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
