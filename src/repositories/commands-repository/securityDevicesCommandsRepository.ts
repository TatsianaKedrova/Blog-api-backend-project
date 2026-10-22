import { SecurityDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";
import { injectable } from "inversify";
import { SecurityDeviceModel } from "../../db/mongoose/models/sessions.model";

@injectable()
export class SecurityDevicesCommandsRepository {
  async createDeviceSession(
    sessionData: SecurityDeviceDBType,
  ): Promise<string> {
    const result = await SecurityDeviceModel.create(sessionData);
    return result._id.toString();
  }
  async updateLastActiveDate(
    deviceId: string,
    userId: string,
    refreshTokenCreationDate: Date,
    refreshTokenExpirationDate: Date,
  ): Promise<boolean> {
    const isLastActiveTimeUpdated = await SecurityDeviceModel.updateOne(
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
    const result = await SecurityDeviceModel.deleteOne({
      userId,
      _id: deviceId,
    });
    return result.deletedCount > 0;
  }
  async isAllOtherSessionsDeleted(
    userId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    const result = await SecurityDeviceModel.deleteMany({
      userId,
      _id: { $ne: currentDeviceId },
    });
    return result.deletedCount > 0;
  }
}
