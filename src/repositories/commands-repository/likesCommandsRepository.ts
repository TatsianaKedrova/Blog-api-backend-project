import { inject } from "inversify";
import { LikeStatus } from "../../dto/commentsDTO/likesDTO";
import { TYPES } from "../../constants/tokens";
import { LikeDislikeModel } from "../../db/mongoose/models/likes.model";

export class LikesCommandsRepository {
  constructor(
    @inject(TYPES.LikeDislikeModel)
    private readonly likeDislikeModel: typeof LikeDislikeModel,
  ) {}
  async changeLikesDislikesStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatus,
  ): Promise<void> {
    if (likeStatus === "none") {
      const deleteStatusRow = await this.likeDislikeModel.deleteOne({
        commentId,
        userId,
      });
      return;
    }
    await this.likeDislikeModel.updateOne(
      {
        commentId,
        userId,
      },
      {
        $set: {
          createdAt: new Date(),
          likesStatus: likeStatus,
        },
      },
      { upsert: true },
    );
    return;
  }
}
