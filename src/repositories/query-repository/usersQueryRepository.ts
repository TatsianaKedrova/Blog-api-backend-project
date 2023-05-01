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
    const filter1: Filter<UserDBType> = {};
    const filter2: Filter<UserDBType> = {};

    if (searchEmailTerm) {
      filter1.email = { $regex: searchEmailTerm, $options: "i" };
    }
    if (searchLoginTerm) {
      filter2.login = { $regex: searchLoginTerm, $options: "i" };
    }
    const foundUsers = await usersCollection
      .find({
        $or: [filter1, filter2],
      })
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