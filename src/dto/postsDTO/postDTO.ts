import { Types } from "mongoose";

export class PostDBType {
  public _id: Types.ObjectId;
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: Types.ObjectId;
  public blogName: string;
  public createdAt: Date;
  constructor(data: {
    _id: Types.ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: Types.ObjectId;
    blogName: string;
    createdAt: Date;
  }) {
    this._id = data._id;
    this.title = data.title;
    this.shortDescription = data.shortDescription;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.blogId = data.blogId;
    this.blogName = data.blogName;
  }
}

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostInputModel = {
  title: string; //required, maxLength = 30
  shortDescription: string; //required, maxLength = 100
  content: string; //required, maxLength = 1000
  blogId: string; //required
};

export type CreatePostForSpecificBlogType = Omit<PostInputModel, "blogId">;
