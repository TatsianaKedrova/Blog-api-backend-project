import { SortDirections } from "../common/PaginatorModel";

export type BlogsQueryParamsType = {
  searchNameTerm: string; //default = null
  sortBy: string; //default = createdAt
  sortDirection: SortDirections; //default = desc
  pageNumber: number; //default = 1
  pageSize: number; //default = 10
};
