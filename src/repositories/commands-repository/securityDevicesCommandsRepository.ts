import { SecurityDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";
import { inject, injectable } from "inversify";
import { SecurityDeviceModel } from "../../db/mongoose/models/sessions.model";

@injectable()
export class SecurityDevicesCommandsRepository {
  constructor(
    @inject(SecurityDeviceModel)
    private readonly securityDeviceModel: typeof SecurityDeviceModel,
  ) {}
  async createDeviceSession(
    sessionData: Omit<SecurityDeviceDBType, "_id">,
  ): Promise<string> {
    const result = await this.securityDeviceModel.create(sessionData);
    return result._id.toString();
  }
  async updateLastActiveDate(
    deviceId: string,
    userId: string,
    refreshTokenCreationDate: Date,
    refreshTokenExpirationDate: Date,
  ): Promise<boolean> {
    const isLastActiveTimeUpdated = await this.securityDeviceModel.updateOne(
      { _id: deviceId, userId },
      {
        $set: {
          lastActiveDate: refreshTokenCreationDate,
          refreshTokenExpirationDate,
        },
      },
    );
    return isLastActiveTimeUpdated.matchedCount > 0;
  }
  async deleteSessionByDeviceAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.securityDeviceModel.deleteOne({
      userId,
      _id: deviceId,
    });
    return result.deletedCount > 0;
  }
  async isAllOtherSessionsDeleted(
    userId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    const result = await this.securityDeviceModel.deleteMany({
      userId,
      _id: { $ne: currentDeviceId },
    });
    return result.deletedCount > 0;
  }
}
