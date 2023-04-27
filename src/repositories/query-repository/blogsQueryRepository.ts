import { Filter, ObjectId } from "mongodb";
import { blogsCollection } from "../../db";
import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/BlogModel";
import { BlogsQueryParamsType } from "../../dto/blogsDTO/BlogsQueryParamsModel";
import { Paginator } from "../../dto/common/PaginatorModel";
import { transformBlogsResponse } from "../../utils/blogs-utils/transformBlogsResponse";

export const blogsQueryRepository = {
  async findBlogs(
    queryParams: BlogsQueryParamsType
  ): Promise<Paginator<BlogViewModel>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      queryParams;
    let sortByTransformed = sortBy === "id" ? "_id" : sortBy;
    let skip = ((pageNumber || 1) - 1) * (pageSize || 10);
    let filter: Filter<BlogDBType> = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm };
    }
    const totalCount = await blogsCollection.countDocuments(filter);
    const foundBlogs: BlogViewModel[] = await blogsCollection
      .find<BlogDBType>(filter)
      .sort(sortByTransformed, sortDirection ? sortDirection : "desc")
      .skip(skip)
      .limit(+pageSize)
      .toArray();
    const transformedData = foundBlogs.map((doc) =>
      transformBlogsResponse(doc)
    );
    let pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: transformedData,
    };
  },
  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsCollection.findOne<BlogDBType>({
      _id: new ObjectId(id),
    });
    if (foundBlog) {
      return transformBlogsResponse(foundBlog);
    }
    return foundBlog;
  },
};
