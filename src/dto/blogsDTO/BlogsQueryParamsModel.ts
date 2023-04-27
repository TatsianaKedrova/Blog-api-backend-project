import { SortDirections } from "../common/PaginatorModel";
import { BlogViewModel } from "./BlogModel";

export type BlogsQueryParamsType = {
  searchNameTerm: string; //default = null
  sortBy: keyof BlogViewModel; //default = createdAt
  sortDirection: SortDirections; //default = desc
  pageNumber: number; //default = 1
  pageSize: number; //default = 10
};
