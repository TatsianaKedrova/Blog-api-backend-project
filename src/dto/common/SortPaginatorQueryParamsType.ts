import { SortDirections } from "./PaginatorModel";

export type BlogsPostsQueryParams<T> = PagingSortingQueryParams<T> & {
  searchNameTerm: string | null; //default = null
};
export type PagingSortingQueryParams<T> = {
  sortBy: keyof T; //default = createdAt
  sortDirection: SortDirections; //default = desc
  pageNumber: number; //default = 1
  pageSize: number; //default = 10
};
