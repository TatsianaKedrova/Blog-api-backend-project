import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { UserDBTypeWithId, UserViewModel } from "../../dto/usersDTO/usersDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { transformUsersResponse } from "../../utils/usersUtils/transformUsersResponse";
import { injectable } from "inversify";
import { UserModel } from "../../db/mongoose/models/user.model";
import { QueryFilter, SortOrder, Types } from "mongoose";

@injectable()
export class UsersQueryRepository {
  async getUsers(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
    searchEmailTerm: string,
    searchLoginTerm: string,
  ): Promise<Paginator<UserViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const filterTotal: Array<QueryFilter<UserDBTypeWithId>> = [];

    if (searchEmailTerm) {
      filterTotal.push({
        "accountData.email": { $regex: searchEmailTerm, $options: "ix" },
      });
    }
    if (searchLoginTerm) {
      filterTotal.push({
        "accountData.login": { $regex: searchLoginTerm, $options: "ix" },
      });
    }
    const filter: QueryFilter<UserDBTypeWithId> =
      filterTotal.length > 0 ? { $or: filterTotal } : {};

    const totalCount = await UserModel.countDocuments(filter);

    const foundUsers = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    return paginatorReturnObject<UserDBTypeWithId>(
      foundUsers,
      transformUsersResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
  }
  async findUserById(
    id: string | Types.ObjectId,
  ): Promise<UserDBTypeWithId | null> {
    const foundUser = await UserModel.findOne({ _id: id }).lean();
    return foundUser;
  }
  async findUserByConfirmationCode(
    code: string,
  ): Promise<UserDBTypeWithId | null> {
    const foundUser = await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }).lean();
    return foundUser;
  }
  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDBTypeWithId | null> {
    const user = await UserModel.findOne({
      $or: [
        { "accountData.login": loginOrEmail },
        { "accountData.email": loginOrEmail },
      ],
    }).lean();
    return user;
  }
  async findUserByEmail(email: string): Promise<UserDBTypeWithId | null> {
    const user = await UserModel.findOne({ "accountData.email": email }).lean();
    return user;
  }
  async findUserByEmailAndLogin(
    login: string,
    email: string,
  ): Promise<boolean> {
    const isUserExist = await UserModel.findOne({
      $or: [{ "accountData.login": login }, { "accountData.email": email }],
    });
    return !!isUserExist;
  }
}
