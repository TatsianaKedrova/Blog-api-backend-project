export type PostViewModel = Required<{
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}>;

export type PostInputModel = Required<{
  title: string; //required, maxLength = 30
  shortDescription: string; //required, maxLength = 100
  content: string; //required, maxLength = 1000
  blogId: string; //required
}>;
