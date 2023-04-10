export type BlogViewModel = Required<{
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}>;
export type BlogInputModel = Required<{
  name: string; //required, maxLength = 15
  description: string; //required, maxLength = 500
  websiteUrl: string; //required, maxLength = 100, pattern = ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}>;
