import {
  CommentDBType,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import { CommentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { PostsQueryRepository } from "../repositories/query-repository/postsQueryRepository";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { transformCommentsResponse } from "../utils/comments-utils/transformCommentsResponse";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

export class CommentsService {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsCommandsRepository: CommentsCommandsRepository,
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
    const newComment: CommentDBType = {
      postId,
      content,
      createdAt: creationDate(),
      commentatorInfo: {
        userId,
        userLogin: foundUser!.accountData.login,
      },
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
  async updateCommentById(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const updatedComment = await this.commentsCommandsRepository.updateComment(
      commentId,
      content,
    );
    return updatedComment;
  }
}
