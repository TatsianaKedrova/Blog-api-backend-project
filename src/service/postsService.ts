import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/postDTO";
import { transformPostsResponse } from "../utils/posts-utils/transformPostsResponse";
import { BlogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { PostsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { inject, injectable } from "inversify";
import { creationDate } from "../utils/date/dateUtils";
import { Types } from "mongoose";

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsCommandsRepository)
    private readonly postsCommandsRepository: PostsCommandsRepository,
  ) {}
  async createNewPost(
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<PostViewModel | null> {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost: Omit<PostDBType, "_id"> = {
      title,
      shortDescription,
      content,
      blogId: new Types.ObjectId(blogId),
      blogName: blog.name,
      createdAt: creationDate(),
    };
    const newPostId = await this.postsCommandsRepository.createNewPost(newPost);
    const postTransformedResult = transformPostsResponse({
      ...newPost,
      _id: newPostId,
    });
    return postTransformedResult;
  }
  async updatePostById(postId: string, body: PostInputModel): Promise<boolean> {
    const { blogId, ...updatedPayload } = body;
    const blog = await this.blogsQueryRepository.findBlogById(body.blogId);
    if (!blog) {
      return false;
    }

    return await this.postsCommandsRepository.updatePostById(
      postId,
      updatedPayload,
    );
  }
  async deletePostById(id: string): Promise<boolean> {
    return await this.postsCommandsRepository.deletePostById(id);
  }
}
