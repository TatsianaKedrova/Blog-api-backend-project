import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";

export const transformCommentsResponse = (
  newComment: CommentDBType,
  id: string
): CommentViewModel => {
  return {
    id,
    content: newComment.content,
    createdAt: newComment.createdAt,
    commentatorInfo: newComment.commentatorInfo,
  };
};
