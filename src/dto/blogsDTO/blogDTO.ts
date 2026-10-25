import { Types } from "mongoose";

export class BlogDBType {
  public _id: Types.ObjectId;
  public name: string;
  public description: string;
  public websiteUrl: string;
  public createdAt: Date;
  public isMembership: boolean;
  constructor(data: {
    _id: Types.ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
  }) {
    this._id = data._id;
    this.createdAt = data.createdAt;
    this.description = data.description;
    this.isMembership = data.isMembership;
    this.websiteUrl = data.websiteUrl;
    this.name = data.name;
  }
}

export type BlogInputModel = {
  name: string; //required, maxLength = 15
  description: string; //required, maxLength = 500
  websiteUrl: string; //required, maxLength = 100, pattern = ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
};

export type BlogPostInputModel = {
  title: string; //required, maxLength = 30
  shortDescription: string; //required, maxLength = 100
  content: string; //required, maxLength = 1000
};

export type BlogViewModel = Omit<BlogDBType, "_id" | "createdAt"> & {
  id: string;
  createdAt: string;
};
