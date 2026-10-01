import { PaginationSortingQueryParams } from "../common/SortPaginatorQueryParamsType";

export type UserInputModel = {
  login: string; // maxLength: 10, minLength: 3, pattern: ^[a-zA-Z0-9_-]*$
  password: string; // maxLength: 20, minLength: 6
  email: string; // pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export class UserDBType {
  public accountData: {
    login: string;
    email: string;
    createdAt: string;
    passwordHash: string;
    passwordSalt: string;
  };
  public emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string | null;
    expirationDate: string | null;
  };
  public isAddedBySuperAdmin: boolean;

  constructor(
    accountData: {
      login: string;
      email: string;
      createdAt: string;
      passwordHash: string;
      passwordSalt: string;
    },
    emailConfirmation: {
      isConfirmed: boolean;
      confirmationCode: string | null;
      expirationDate: string | null;
    },
    isAddedBySuperAdmin: boolean,
  ) {
    this.accountData = accountData;
    this.emailConfirmation = emailConfirmation;
    this.isAddedBySuperAdmin = isAddedBySuperAdmin;
  }
}

export type UsersQueryParams = PaginationSortingQueryParams & {
  searchLoginTerm: string;
  searchEmailTerm: string;
};
