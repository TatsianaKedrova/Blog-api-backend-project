import { ObjectId, SortDirection } from "mongodb";
import { commentsCollection, postsCollection } from "../../db";
import { PostDBType, PostViewModel } from "../../dto/postsDTO/PostModel";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { Paginator } from "../../dto/common/PaginatorModel";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";

class PostsQueryRepository {
  async findPosts(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection,
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
      pageNumber,
    );
    return posts;
  }
  async findPostById(id: string): Promise<PostDBType | null> {
    const foundPost = await postsCollection.findOne<PostDBType>({
      _id: new ObjectId(id),
    });
    return foundPost;
  }
  async _findPostById(id: string): Promise<PostDBType | null> {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return foundPost;
  }

}

export const postsQueryRepository = new PostsQueryRepository();
