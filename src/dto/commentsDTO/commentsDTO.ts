import { Types } from "mongoose";

export type CommentInputModel = {
  content: string; // maxLength: 300, minLength: 20
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string; //date-time
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
  constructor(data: {
    _id: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    userLogin: string;
    createdAt: Date;
    postId: Types.ObjectId;
  }) {
    this._id = data._id;
    this.userId = data.userId;
    this.userLogin = data.userLogin;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.postId = data.postId;
  }
}
