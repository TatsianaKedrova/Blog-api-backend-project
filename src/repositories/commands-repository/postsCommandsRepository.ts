import { PostDBType, PostInputModel } from "../../dto/postsDTO/postDTO";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { postsCollection } from "../../db/mongoDB/mongoDB";
import { BlogsModel } from "../../db/mongoose/models/blogs.model";

@injectable()
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
      const blog = await BlogsModel.findOne({ _id: blogId });
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
