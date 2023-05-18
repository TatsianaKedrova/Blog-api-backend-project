import { WithId } from "mongodb";
import { UserDBType } from "../../dto/usersDTO/usersDTO";

export const getCurrentUserInfo = (user: WithId<UserDBType>) => {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
};
