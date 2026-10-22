import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";
import { ObjectId, SortDirection, WithId } from "mongodb";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { PostsQueryRepository } from "./postsQueryRepository";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { inject, injectable } from "inversify";
import { commentsCollection } from "../../db/nativeMongoDB/mongoDB";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  async findCommentById(id: string): Promise<WithId<CommentDBType> | null> {
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
