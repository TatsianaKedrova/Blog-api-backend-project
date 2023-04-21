import { ObjectId } from "mongodb";
import { postsCollection } from "../../db";
import { PostDBType, PostViewModel } from "../../dto/postsDTO/PostModel";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";

export const postsQueryRepository = {
  async findPosts(): Promise<PostViewModel[]> {
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
};
