import { ObjectId } from "mongodb";

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
  public _id?: ObjectId;
  public content: string;
  public commentatorInfo: CommentatorInfo;
  public createdAt: string;
  public postId: string;
  constructor(data: {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    postId: string;
  }) {
    this._id = data._id;
    this.commentatorInfo = data.commentatorInfo;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.postId = data.postId;
  }
}
