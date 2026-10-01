import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";

class CommentsService {
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
