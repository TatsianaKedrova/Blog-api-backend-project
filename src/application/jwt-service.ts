import { UserDBType } from "./../dto/usersDTO/usersDTO";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ObjectId, WithId } from "mongodb";
import { JwtPayloadResult } from "../dto/common/jwt/JwtPayloadResult";

dotenv.config();

export const jwtService = {
  async createJWT(user: WithId<UserDBType>, secret: string, expiresIn: number) {
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn,
    });
    return token;
  },
  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      return new ObjectId((result as JwtPayloadResult).userId);
    } catch (error) {
      return null;
    }
  },
};
