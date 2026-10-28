import { PostDBType, PostViewModel } from "../../dto/postsDTO/postDTO";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { Paginator } from "../../dto/common/PaginatorModel";
import { PostModel } from "../../db/mongoose/models/post.model";
import { SortOrder } from "mongoose";
import { inject } from "inversify";
import { Model } from "mongoose";

export class PostsQueryRepository {
  constructor(
    @inject(PostModel) private readonly postModel: Model<PostDBType>,
  ) {}
  async findPosts(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
  ): Promise<Paginator<PostViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const totalCount = await this.postModel.countDocuments();
    const foundPosts = await this.postModel
      .find()
      .collation({ locale: "en" })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const posts = paginatorReturnObject<PostDBType>(
      foundPosts,
      transformPostsResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
    return posts;
  }
  async findPostById(id: string): Promise<PostDBType | null> {
    const foundPost = await this.postModel.findById<PostDBType>(id).lean();
    return foundPost;
  }
}
