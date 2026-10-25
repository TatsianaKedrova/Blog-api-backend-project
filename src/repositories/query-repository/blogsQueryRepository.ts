import { Filter, ObjectId, SortDirection } from "mongodb";
import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/blogDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { transformBlogsResponse } from "../../utils/blogs-utils/transformBlogsResponse";
import { PostDBType, PostViewModel } from "../../dto/postsDTO/postDTO";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { injectable } from "inversify";
import { postsCollection } from "../../db/mongoDB/mongoDB";
import { BlogsModel } from "../../db/mongoose/models/blogs.model";
import { SortOrder } from "mongoose";

@injectable()
export class BlogsQueryRepository {
  async findBlogs(
    searchNameTerm: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
  ): Promise<Paginator<BlogViewModel>> {
    let filter: Filter<BlogDBType> = {};
    const skip = paginationHandler(pageNumber, pageSize);
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }
    const totalCount = await BlogsModel.countDocuments(filter);
    const foundBlogs = await BlogsModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    return paginatorReturnObject<BlogDBType>(
      foundBlogs,
      transformBlogsResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
  }
  async findPostsForSpecificBlog(
    id: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection,
  ): Promise<Paginator<PostViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);

    const totalCount = await postsCollection.countDocuments({
      blogId: new ObjectId(id),
    });
    const foundPosts = await postsCollection
      .find({ blogId: new ObjectId(id) })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return paginatorReturnObject<PostDBType>(
      foundPosts,
      transformPostsResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
  }
  async findBlogById(id: string): Promise<BlogDBType | null> {
    return await BlogsModel.findById<BlogDBType>(id).lean();
  }
}
