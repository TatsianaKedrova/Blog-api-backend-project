import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";

export const transformCommentsResponse = (
  newComment: CommentDBType,
): CommentViewModel => {
  return {
    id: newComment._id.toString(),
    content: newComment.content,
    createdAt: newComment.createdAt.toISOString(),
    commentatorInfo: {
      userId: newComment.userId.toString(),
      userLogin: newComment.userLogin,
    },
  };
};
