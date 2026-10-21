import { UserDBTypeWithId } from "../../dto/usersDTO/usersDTO";

export const getCurrentUserInfo = (user: UserDBTypeWithId) => {
  return {
    email: user.accountData.email,
    login: user.accountData.login,
    userId: user._id.toString(),
  };
};
