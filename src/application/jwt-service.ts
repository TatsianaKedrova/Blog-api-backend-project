import { UserDBType } from "./../dto/usersDTO/usersDTO";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ObjectId, WithId } from "mongodb";
import { JwtPayloadResult } from "../dto/common/jwt/JwtPayloadResult";

dotenv.config();

export const jwtService = {
  async createJWT(
    user: WithId<UserDBType>,
    secret: string,
    expiresIn: number
  ): Promise<string> {
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn,
    });
    return token;
  },
  async getUserIdByToken(token: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      return new ObjectId((result as JwtPayloadResult).userId);
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
};
