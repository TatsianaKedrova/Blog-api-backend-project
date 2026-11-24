import { Types } from "mongoose";

export type CommentInputModel = {
  content: string; // maxLength: 300, minLength: 20
};

export type LikesInfoViewModel = {
  likesCount: number; //Total likes for parent item
  dislikesCount: number; //Total dislikes for parent item
  myStatus: LikeStatus; //Send None if you want to unlike\undislike
};
export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export class CommentDBType {
  public _id: Types.ObjectId;
  public content: string;
  public userId: Types.ObjectId;
  public userLogin: string;
  public createdAt: Date;
  public postId: Types.ObjectId;
  public likesCount: number;
  public dislikesCount: number;
  myStatus: LikeStatus;
  constructor(data: {
    _id: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    userLogin: string;
    createdAt: Date;
    postId: Types.ObjectId;
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  }) {
    this._id = data._id;
    this.userId = data.userId;
    this.userLogin = data.userLogin;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.postId = data.postId;
    this.likesCount = data.likesCount;
    this.dislikesCount = data.dislikesCount;
    this.myStatus = data.myStatus;
  }
}
export const LIKE_STATUSES = ["none", "like", "dislike"] as const;
export type LikeStatus = (typeof LIKE_STATUSES)[number];

export type LikeInputModel = {
  likeStatus: LikeStatus;
};
