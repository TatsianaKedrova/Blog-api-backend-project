import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { Paginator } from "../../dto/common/PaginatorModel";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";
import { injectable } from "inversify";
import { CommentModel } from "../../db/mongoose/models/comments.model";
import { SortOrder } from "mongoose";

@injectable()
export class CommentsQueryRepository {
  constructor() {}
  async findCommentById(id: string): Promise<CommentDBType | null> {
    const comment = await CommentModel.findById(id).lean();
    return comment;
  }
  async findCommentsForSpecifiedPost(
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortOrder,
    postId: string,
  ): Promise<Paginator<CommentViewModel> | null> {
    const skip = paginationHandler(pageNumber, pageSize);
    const totalCount = await CommentModel.countDocuments({
      postId,
    });

    const allCommentsForPost: CommentDBType[] = await CommentModel.find({
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
