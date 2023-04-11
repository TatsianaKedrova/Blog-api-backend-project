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
  createNewPost(body: PostInputModel): PostViewModel | undefined {
    const { title, shortDescription, content, blogId } = body;
    const blog = db.blogs.find((blog) => blog.id === blogId);
    if (!blog) {
      return blog;
    } else {
      const newPost: PostViewModel = {
        id: randomUUID(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
      };
      db.posts.push(newPost);
      return newPost;
    }
  },
  updatePostById(id: string, body: PostInputModel): boolean {
    const { blogId, content, shortDescription, title } = body;
    const foundPostById = db.posts.find((post) => post.id === id);
    const blog = db.blogs.find((blog) => blog.id === blogId);
    if (!foundPostById) {
      return false;
    } else {
      foundPostById.blogId = blogId;
      foundPostById.content = content;
      foundPostById.shortDescription = shortDescription;
      foundPostById.title = title;
      foundPostById.blogName = blog!.name;
      return true;
    }
  },
  deletePostById(id: string): boolean {
    for (let i = 0; i < db.posts.length; i++) {
      if (db.posts[i].id === id) {
        db.posts.splice(i, 1);
        return true;
      }
    }
    return false;
  },
};
