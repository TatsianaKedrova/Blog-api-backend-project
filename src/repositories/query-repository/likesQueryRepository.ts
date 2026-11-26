import { inject, injectable } from "inversify";
import { TYPES } from "../../constants/tokens";
import { LikeDislikeModel } from "../../db/mongoose/models/likes.model";
import { LikeStatus } from "../../dto/commentsDTO/likesDTO";

@injectable()
export class LikesQueryRepository {
  constructor(
    @inject(TYPES.LikeDislikeModel)
    private readonly likesDislikesModel: typeof LikeDislikeModel,
  ) {}
  async findUserReaction(
    userId: string,
    commentId: string,
  ): Promise<LikeStatus> {
    const likesStatus = await this.likesDislikesModel
      .findOne({
        commentId,
        userId,
      })
      .lean();
    return likesStatus?.likesStatus ?? "none";
  }
}
