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

export type AccountDataType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
};
export type EmailConfirmationType = {
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: string | null;
};

export class UserDBTypeClass {
  constructor(
    public accountData: AccountDataType,
    public emailConfirmation: EmailConfirmationType,
  ) {}
}

export type UserDBType = {
  accountData: {
    login: string;
    email: string;
    createdAt: string;
    passwordHash: string;
    passwordSalt: string;
  };
  emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string | null;
    expirationDate: string | null;
  };
  isAddedBySuperAdmin: boolean;
};

export type UsersQueryParams = PaginationSortingQueryParams & {
  searchLoginTerm: string;
  searchEmailTerm: string;
};
