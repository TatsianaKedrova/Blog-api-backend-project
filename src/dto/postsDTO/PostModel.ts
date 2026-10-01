import { ObjectId } from "mongodb";

export class PostDBType {
  public _id?: ObjectId;
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: ObjectId;
  public blogName: string;
  public createdAt: string;
  constructor(data: {
    _id?: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string;
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