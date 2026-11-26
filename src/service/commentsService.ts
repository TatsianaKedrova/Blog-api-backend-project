import { inject, injectable } from "inversify";
import {
  CommentDBType,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import { CommentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { PostsQueryRepository } from "../repositories/query-repository/postsQueryRepository";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { transformCommentsResponse } from "../utils/comments-utils/transformCommentsResponse";
import { creationDate } from "../utils/date/dateUtils";
import { Types } from "mongoose";
import { CommentsQueryRepository } from "../repositories/query-repository/commentsQueryRepository";
import { LikeStatus } from "../dto/commentsDTO/likesDTO";
import { LikesQueryRepository } from "../repositories/query-repository/likesQueryRepository";
import { LikesCommandsRepository } from "../repositories/commands-repository/likesCommandsRepository";

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
    @inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
    @inject(CommentsCommandsRepository)
    private readonly commentsCommandsRepository: CommentsCommandsRepository,
    @inject(CommentsQueryRepository)
    private readonly commentsQueryRepository: CommentsQueryRepository,
    @inject(LikesQueryRepository)
    protected readonly likesQueryRepository: LikesQueryRepository,
    @inject(LikesCommandsRepository)
    protected readonly likesCommandsRepository: LikesCommandsRepository,
  ) {}

  async createNewComment(
    postId: string,
    content: string,
    userId: string,
  ): Promise<CommentViewModel | null> {
    const foundPost = await this.postsQueryRepository.findPostById(postId);
    if (!foundPost) {
      return null;
    }
    const foundUser = await this.usersQueryRepository.findUserById(userId);
    if (!foundUser) return null;
    const newComment: Omit<CommentDBType, "_id"> = {
      postId: new Types.ObjectId(postId),
      content,
      createdAt: creationDate(),
      userId: new Types.ObjectId(userId),
      userLogin: foundUser.accountData.login,
      likesCount: 0,
      dislikesCount: 0,
    };
    const createdComment =
      await this.commentsCommandsRepository.createComment(newComment);
    const transformedComment = transformCommentsResponse({
      ...newComment,
      _id: createdComment,
    });
    return transformedComment;
  }
  async deleteCommentById(commentId: string): Promise<boolean> {
    const deletedComment =
      await this.commentsCommandsRepository.deleteComment(commentId);
    return deletedComment;
  }
  async updateCommentContentById(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const updatedComment =
      await this.commentsCommandsRepository.updateCommentContent(
        commentId,
        content,
      );
    return updatedComment;
  }
  async changeLikeStatus(
    likeStatus: LikeStatus,
    userId: string,
    commentId: string,
  ): Promise<boolean> {
    const comment =
      await this.commentsQueryRepository.findCommentById(commentId);
    if (!comment) {
      return false;
    }
    const oldLikeStatus = await this.likesQueryRepository.findUserReaction(
      userId,
      commentId,
    );

    if (oldLikeStatus === likeStatus) return true;
    const changeLikeDislikeStatus =
      await this.likesCommandsRepository.changeLikesDislikesStatus(
        userId,
        commentId,
        likeStatus,
      );
    return true;
  }
}
