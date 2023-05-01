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
    searchEmailTerm: string | null,
    searchLoginTerm: string | null
  ): Promise<Paginator<UserViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const totalCount = await usersCollection.countDocuments();
    const filter: Filter<UserDBType> = {};
    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm };
    }
    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm };
    }
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
};