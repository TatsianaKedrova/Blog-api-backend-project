import { randomUUID } from "crypto";
import { PostInputModel, PostViewModel } from "../dto/postsDTO/PostViewModel";
import { db } from "../temporal-database/project-db";

export const postsList = db.posts;

export const postsRepository = {
  getListOfPosts() {
    return postsList;
  },
  findPostById(id: string): PostViewModel | undefined {
    const foundPostById = db.posts.find((element) => element.id === id);
    return foundPostById;
  },
  createNewPost(body: PostInputModel): PostInputModel | undefined {
    const { title, shortDescription, content, blogId } = body;
    const blogNameValue = db.blogs.find((blog) => blog.id === blogId);
    if (!blogNameValue) {
      return blogNameValue;
    } else {
      const newPost: PostViewModel = {
        id: randomUUID(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: blogNameValue.name,
      };
      db.posts.push(newPost);
      return newPost;
    }
  },
};
