import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { db } from "../temporal-database/project-db";
import { blogsCollection, postsCollection } from "../db";
import { transformPostsResponse } from "../utils/posts-utils/transformPostsResponse";
import { blogsRepository } from "./blogs-db-repository";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId } from "mongodb";

export const postsRepository = {
  async getListOfPosts(): Promise<PostViewModel[]> {
    return (await postsCollection.find<PostDBType>({}).toArray()).map((doc) =>
      transformPostsResponse(doc)
    );
  },
  async findPostById(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsCollection.findOne<PostDBType>({
      _id: new ObjectId(id),
    });
    if (foundPost) {
      return transformPostsResponse(foundPost);
    }
    return foundPost;
  },
  async createNewPost(body: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = body;
    const blog = await blogsRepository.findBlogById(blogId);
    const newPost = {
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog!.name,
      createdAt: creationDate,
    };
    const result = await postsCollection.insertOne(newPost);
    return transformPostsResponse(newPost, result.insertedId.toString());
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = body;
    const foundPostById = await postsCollection.findOne({
      _id: new ObjectId(id),
    });
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (!foundPostById) {
      return false;
    } else {
      const updatedResult = await postsCollection.updateOne(
        { _id: foundPostById._id },
        {
          $set: {
            blogId: new ObjectId(blogId),
            content,
            shortDescription,
            title,
            blogName: blog?.name,
          },
        }
      );
      return updatedResult.matchedCount === 1;
    }
  },
  async deletePostById(id: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
