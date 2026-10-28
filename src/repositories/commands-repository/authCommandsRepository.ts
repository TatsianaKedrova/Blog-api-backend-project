import { injectable } from "inversify";
import { BlacklistedRefreshTokenModel } from "../../db/mongoose/models/blacklistedRefreshToken.model";
@injectable()
export class AuthCommandsRepository {
  async putRefreshTokenToBlacklist(
    token: string,
    userId: string,
  ): Promise<void> {
    await BlacklistedRefreshTokenModel.create({
      userId,
      token,
    });
  }
}
