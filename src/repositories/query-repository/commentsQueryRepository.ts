import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { PostsQueryRepository } from "./postsQueryRepository";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { inject, injectable } from "inversify";
import { CommentModel } from "../../db/mongoose/models/comments.model";
import { SortOrder } from "mongoose";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  async findCommentById(id: string): Promise<CommentDBType | null> {
    const comment = await CommentModel.findById(id).lean();
    return comment;
  }
  async findCommentsForSpecifiedPost(
    postId: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
  ): Promise<Paginator<CommentViewModel> | null> {
    const foundPost = await this.postsQueryRepository.findPostById(postId);
    if (!foundPost) return null;
    const skip = paginationHandler(pageNumber, pageSize);
    const totalCount = await CommentModel.countDocuments({
      postId,
    });

    const allCommentsForPost = await CommentModel.find({
      postId,
    })
      .collation({ locale: "en" })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
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
