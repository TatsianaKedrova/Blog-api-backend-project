import { WithId } from "mongodb";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";

export const transformUsersResponse = (
  user: WithId<UserDBType>
): UserViewModel => {
  return {
    id: user._id?.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
