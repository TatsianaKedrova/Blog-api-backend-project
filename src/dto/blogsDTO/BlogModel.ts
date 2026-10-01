
export class BlogDBType {
  public name: string;
  public description: string;
  public websiteUrl: string;
  public createdAt: string;
  public isMembership: boolean;
  constructor(data: {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
  }) {
    this.createdAt = data.createdAt;
    this.description = data.description;
    this.isMembership = data.isMembership;
    this.websiteUrl = data.websiteUrl;
    this.name = data.name;
  }
}

export type BlogViewModel = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean; //MUST be false. True if user has not expired membership subscription to blog
};

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
