import { Types } from "mongoose";

export const LIKE_STATUSES = ["none", "like", "dislike"] as const;
export type LikeStatus = (typeof LIKE_STATUSES)[number];

export type LikeInputModel = {
  likeStatus: LikeStatus;
};

export type LikesInfoViewModel = {
  likesCount: number; //Total likes for parent item
  dislikesCount: number; //Total dislikes for parent item
  myStatus: LikeStatus; //Send None if you want to unlike\undislike
};

export class LikesDBType {
  public commentId: Types.ObjectId;
  public userId: Types.ObjectId;
  public likesStatus: LikeStatus;
  public createdAt: Date;
  constructor(data: {
    commentId: Types.ObjectId;
    userId: Types.ObjectId;
    likesStatus: LikeStatus;
    createdAt: Date;
  }) {
    this.commentId = data.commentId;
    this.userId = data.userId;
    this.likesStatus = data.likesStatus;
    this.createdAt = data.createdAt;
  }
}
