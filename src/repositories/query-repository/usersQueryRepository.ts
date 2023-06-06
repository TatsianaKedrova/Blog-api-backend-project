import { Filter, SortDirection } from "mongodb";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";
import { usersCollection } from "../../db";
import { Paginator } from "../../dto/common/PaginatorModel";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { transformUsersResponse } from "../../utils/usersUtils/transformUsersResponse";

export const usersQueryRepository = {
  async getUsers(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection,
    searchEmailTerm: string,
    searchLoginTerm: string
  ): Promise<Paginator<UserViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const filterTotal: Array<Filter<UserDBType>> = [];
    const filterEmail: Filter<UserDBType> = {};
    const filterLogin: Filter<UserDBType> = {};

    if (searchEmailTerm) {
      filterEmail.email = { $regex: searchEmailTerm, $options: "i" };
      filterTotal.push(filterEmail);
    }
    if (searchLoginTerm) {
      filterLogin.login = { $regex: searchLoginTerm, $options: "i" };
      filterTotal.push(filterLogin);
    }
    const filter = {
      $or: filterTotal.length > 0 ? filterTotal : [{}],
    };
    const totalCount = await usersCollection.countDocuments(filter);

    const foundUsers = await usersCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return paginatorReturnObject<UserDBType>(
      foundUsers,
      transformUsersResponse,
      totalCount,
      pageSize,
      pageNumber
    );
  },
  async findByLoginOrEmail(loginOrEmail: string) {
    const isUserExist = await usersCollection.findOne({
      $or: [
        { "accountData.login": loginOrEmail },
        { "accountData.email": loginOrEmail },
      ],
    });
    return isUserExist;
  },
};