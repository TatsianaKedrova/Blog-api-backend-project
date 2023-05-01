import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";

export const transformUsersResponse = (
  user: UserDBType,
  id?: string
): UserViewModel => {
  return {
    id: (id as string) ?? user._id?.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
