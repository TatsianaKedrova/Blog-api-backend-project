import { PagingSortingQueryParams } from "../common/SortPaginatorQueryParamsType";

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type UsersQueryParams<T> = PagingSortingQueryParams<T> & {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type LoginSuccessViewModel = {
  accessToken: string; //jwt token
};
