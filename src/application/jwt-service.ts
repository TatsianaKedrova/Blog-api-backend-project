import { UserDBType } from "./../dto/usersDTO/usersDTO";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

export const jwtService = {
  async createJWT(user: UserDBType) {
    const token = jwt.sign(
      { userId: user._id },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    return token;
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.TOKEN_SECRET as string);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
};
