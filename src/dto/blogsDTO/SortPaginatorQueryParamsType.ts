import { SortDirections } from "../common/PaginatorModel";

export type SortPaginatorQueryParamsType<T> = {
  searchNameTerm: string | null; //default = null
  sortBy: keyof T; //default = createdAt
  sortDirection: SortDirections; //default = desc
  pageNumber: number; //default = 1
  pageSize: number; //default = 10
};
