import { UserDBType } from "./../dto/usersDTO/usersDTO";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ObjectId, WithId } from "mongodb";
import { JwtPayloadResult } from "../dto/common/jwt/JwtPayloadResult";

dotenv.config();

export const jwtService = {
  async createJWT(user: WithId<UserDBType>) {
    const token = jwt.sign(
      { userId: user._id },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: "5d",
      }
    );
    return token;
  },
  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, process.env.TOKEN_SECRET as string);
      return new ObjectId((result as JwtPayloadResult).userId);
    } catch (error) {
      return null;
    }
  },
};
