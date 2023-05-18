import { WithId } from "mongodb";
import { UserDBType } from "./src/dto/usersDTO/usersDTO";
export {};
declare global {
  namespace Express {
    export interface Request {
      user: WithId<UserDBType>;
    }
  }
}