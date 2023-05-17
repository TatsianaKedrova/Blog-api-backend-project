import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId, OptionalId } from "mongodb";
import { postsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { blogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import {
  CommentDBType,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import { postsCollection } from "../db";

export const postsService = {
  async _findPostById(id: string): Promise<PostDBType | null> {
    const foundPost = postsCollection.findOne({ _id: new ObjectId(id) });
    return foundPost;
  },
  async createNewPost(body: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = body;
    const blog = await blogsQueryRepository.findBlogById(blogId);
    const newPost: PostDBType = {
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog!.name,
      createdAt: creationDate(),
    };
    return await postsCommandsRepository.createNewPost(newPost);
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    return await postsCommandsRepository.updatePostById(id, body);
  },
  async deletePostById(id: string): Promise<boolean> {
    return await postsCommandsRepository.deletePostById(id);
  },
  async createNewComment(
    postId: string,
    content: string,
    userLogin: string,
    userId: string
  ): Promise<CommentViewModel | null> {
    const foundPost = this._findPostById(postId);
    if (!foundPost) {
      return null;
    }
    const newComment: OptionalId<CommentDBType> = {
      postId,
      content,
      createdAt: creationDate(),
      commentatorInfo: {
        userId,
        userLogin,
      },
    };
    return commentsCommandsRepository.createComment(newComment);
  },
};
