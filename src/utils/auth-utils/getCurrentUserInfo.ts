import { UserDBType } from "../../dto/usersDTO/usersDTO";

export const getCurrentUserInfo = (user: UserDBType) => {
  return {
    email: user.accountData.email,
    login: user.accountData.login,
    userId: user._id.toString(),
  };
};
