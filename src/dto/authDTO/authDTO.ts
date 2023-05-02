import { PagingSortingQueryParams } from "../common/SortPaginatorQueryParamsType";

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type UsersQueryParams<T> = PagingSortingQueryParams<T> & {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};
