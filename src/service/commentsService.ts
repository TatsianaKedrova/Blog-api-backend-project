import {
  CommentDBType,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { postsQueryRepository } from "../repositories/query-repository/postsQueryRepository";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

class CommentsService {
  async createNewComment(
    postId: string,
    content: string,
    userId: string,
  ): Promise<CommentViewModel | null> {
    const foundPost = await postsQueryRepository.findPostById(postId);
    if (!foundPost) {
      return null;
    }
    const foundUser = await usersQueryRepository.findUserById(userId);
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
    return commentsCommandsRepository.createComment(newComment);
  }
  async deleteCommentById(commentId: string): Promise<boolean> {
    const deletedComment =
      await commentsCommandsRepository.deleteComment(commentId);
    return deletedComment;
  }
  async updateCommentById(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const updatedComment = await commentsCommandsRepository.updateComment(
      commentId,
      content,
    );
    return updatedComment;
  }
}

export const commentsService = new CommentsService();
