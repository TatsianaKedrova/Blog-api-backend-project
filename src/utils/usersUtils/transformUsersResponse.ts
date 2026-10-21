import { UserDBTypeWithId, UserViewModel } from "../../dto/usersDTO/usersDTO";

export const transformUsersResponse = (
  user: UserDBTypeWithId,
): UserViewModel => {
  return {
    id: user._id.toString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt.toISOString(),
  };
};
