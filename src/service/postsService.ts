import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { ObjectId } from "mongodb";
import { transformPostsResponse } from "../utils/posts-utils/transformPostsResponse";
import { BlogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { PostsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { inject, injectable } from "inversify";
import { creationDate } from "../utils/date/dateUtils";

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
    postData: Omit<PostInputModel, "blogId"> | PostInputModel,
  ): Promise<PostViewModel | null> {
    const { title, shortDescription, content } = postData;
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost = new PostDBType({
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog.name,
      createdAt: creationDate(),
    });
    const newPostId = await this.postsCommandsRepository.createNewPost(newPost);
    const postTransformedResult = transformPostsResponse({
      ...newPost,
      _id: newPostId,
    });
    return postTransformedResult;
  }
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    return await this.postsCommandsRepository.updatePostById(id, body);
  }
  async deletePostById(id: string): Promise<boolean> {
    return await this.postsCommandsRepository.deletePostById(id);
  }
}
