import { PostDBType, PostInputModel } from "../../dto/postsDTO/PostModel";
import { blogsCollection, postsCollection } from "../../db";
import { ObjectId } from "mongodb";

export class PostsCommandsRepository {
  async createNewPost(newPost: PostDBType): Promise<ObjectId> {
    const result = await postsCollection.insertOne(newPost);
    return result.insertedId;
  }
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = body;
    const foundPostById = await postsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!foundPostById) {
      return false;
    } else {
      const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
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
        },
      );
      return updatedResult.matchedCount === 1;
    }
  }
  async deletePostById(id: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
