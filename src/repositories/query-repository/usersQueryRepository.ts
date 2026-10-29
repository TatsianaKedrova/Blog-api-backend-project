import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { transformUsersResponse } from "../../utils/usersUtils/transformUsersResponse";
import { inject, injectable } from "inversify";
import { UserModel } from "../../db/mongoose/models/user.model";
import { QueryFilter, SortOrder } from "mongoose";

@injectable()
export class UsersQueryRepository {
  constructor(
    @inject(UserModel) private readonly userModel: typeof UserModel,
  ) {}
  async getUsers(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
    searchEmailTerm: string,
    searchLoginTerm: string,
  ): Promise<Paginator<UserViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const filterTotal: Array<QueryFilter<UserDBType>> = [];

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
    const filter: QueryFilter<UserDBType> =
      filterTotal.length > 0 ? { $or: filterTotal } : {};

    const totalCount = await this.userModel.countDocuments(filter);

    const foundUsers = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    return paginatorReturnObject<UserDBType>(
      foundUsers,
      transformUsersResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
  }
  async findUserById(id: string): Promise<UserDBType | null> {
    const foundUser = await this.userModel.findById(id).lean();
    return foundUser;
  }
  async findUserByConfirmationCode(code: string): Promise<UserDBType | null> {
    const foundUser = await this.userModel
      .findOne({
        "emailConfirmation.confirmationCode": code,
      })
      .lean();
    return foundUser;
  }
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    const user = await this.userModel
      .findOne({
        $or: [
          { "accountData.login": loginOrEmail },
          { "accountData.email": loginOrEmail },
        ],
      })
      .select("+accountData.passwordHash")
      .lean();
    return user;
  }
  async findUserByEmail(email: string): Promise<UserDBType | null> {
    const user = await this.userModel
      .findOne({ "accountData.email": email })
      .lean();
    return user;
  }
  async findUserByEmailAndLogin(
    login: string,
    email: string,
  ): Promise<boolean> {
    const isUserExist = await this.userModel.findOne({
      $or: [{ "accountData.login": login }, { "accountData.email": email }],
    });
    return !!isUserExist;
  }
}
