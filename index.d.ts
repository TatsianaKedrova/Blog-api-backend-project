import { UserDBType } from "./src/dto/usersDTO/usersDTO";
export {};
declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
      user: UserDBType | null;
    }
  }
}