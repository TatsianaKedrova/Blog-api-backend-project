import { Types } from "mongoose";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";

export const transformUsersResponse = (
  user: UserDBType & { _id: Types.ObjectId },
): UserViewModel => {
  return {
    id: user._id?.toString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  };
};
