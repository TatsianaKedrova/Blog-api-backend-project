import { ObjectId, SortDirection } from "mongodb";
import { postsCollection } from "../../db";
import { PostDBType, PostViewModel } from "../../dto/postsDTO/PostModel";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { Paginator } from "../../dto/common/PaginatorModel";

export const postsQueryRepository = {
  async findPosts(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection
  ): Promise<Paginator<PostViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);
    const totalCount = await postsCollection.countDocuments();
    const foundPosts = await postsCollection
      .find()
      .collation({ locale: "en" })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const posts = paginatorReturnObject<PostDBType>(
      foundPosts,
      transformPostsResponse,
      totalCount,
      pageSize,
      pageNumber
    );
    return posts;
  },
  async findPostById(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsCollection.findOne<PostDBType>({
      _id: new ObjectId(id),
    });
    if (foundPost) {
      return transformPostsResponse(foundPost);
    }
    return foundPost;
  },
};
