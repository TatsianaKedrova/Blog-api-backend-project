import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";
import { ObjectId, SortDirection } from "mongodb";
import { commentsCollection } from "../../db";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { PostsQueryRepository } from "./postsQueryRepository";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";

export class CommentsQueryRepository {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}
  async findCommentById(id: string): Promise<CommentDBType | null> {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    return comment;
  }
  async findCommentsForSpecifiedPost(
    postId: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection,
  ): Promise<Paginator<CommentViewModel> | null> {
    const foundPost = await this.postsQueryRepository.findPostById(postId);
    if (!foundPost) return null;
    const skip = paginationHandler(pageNumber, pageSize);
    const totalCount = await commentsCollection.countDocuments({
      postId,
    });

    const allCommentsForPost = await commentsCollection
      .find({
        postId,
      })
      .collation({ locale: "en" })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const comments = paginatorReturnObject<CommentDBType>(
      allCommentsForPost,
      transformCommentsResponse,
      totalCount,
      pageSize,
      pageNumber,
    );
    return comments;
  }
}
