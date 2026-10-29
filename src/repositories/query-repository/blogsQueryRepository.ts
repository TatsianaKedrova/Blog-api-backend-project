import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/blogDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { transformBlogsResponse } from "../../utils/blogs-utils/transformBlogsResponse";
import { PostDBType, PostViewModel } from "../../dto/postsDTO/postDTO";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { inject, injectable } from "inversify";
import { BlogModel } from "../../db/mongoose/models/blog.model";
import { QueryFilter, SortOrder } from "mongoose";
import { PostModel } from "../../db/mongoose/models/post.model";

@injectable()
export class BlogsQueryRepository {
  constructor(
    @inject(PostModel) private readonly postModel: typeof PostModel,
    @inject(BlogModel) private readonly blogModel: typeof BlogModel,
  ) {}
  async findBlogs(
    searchNameTerm: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
  ): Promise<Paginator<BlogViewModel>> {
    let filter: QueryFilter<BlogDBType> = {};
    const skip = paginationHandler(pageNumber, pageSize);
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }
    const totalCount = await this.blogModel.countDocuments(filter);
    const foundBlogs = await this.blogModel
      .find(filter)
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
    sortDirection: SortOrder,
  ): Promise<Paginator<PostViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);

    const totalCount = await this.postModel.countDocuments({
      blogId: id,
    });
    const foundPosts = await this.postModel
      .find({ blogId: id })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    return paginatorReturnObject<PostDBType>(
      foundPosts,
      transformPostsResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
  }
  async findBlogById(id: string): Promise<BlogDBType | null> {
    return await this.blogModel.findById<BlogDBType>(id).lean();
  }
}
