import { Filter, SortDirection } from "mongodb";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";
import { usersCollection } from "../../db";
import { Paginator } from "../../dto/common/PaginatorModel";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { transformUsersResponse } from "../../utils/usersUtils/transformUsersResponse";
import { getTotalCountOfDocuments } from "../../utils/common-utils/getTotalCountOfDocuments";

export const usersQueryRepository = {
  async getUsers(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection,
    searchEmailTerm: string | null,
    searchLoginTerm: string | null
  ): Promise<Paginator<UserViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const filterEmail: Filter<UserDBType> = {};
    const filterLogin: Filter<UserDBType> = {};

    if (searchEmailTerm) {
      filterEmail.email = { $regex: searchEmailTerm, $options: "i" };
    }
    if (searchLoginTerm) {
      filterLogin.login = { $regex: searchLoginTerm, $options: "i" };
    }
    const filter = {
      $or: [filterEmail, filterLogin],
    };
    const totalCount = await usersCollection.countDocuments(filter);
    const totalCount1 = await getTotalCountOfDocuments<UserDBType>(
      usersCollection,
      filter
    );

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
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return isUserExist;
  },
};