import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import { SecurityDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";

class SecurityDevicesCommandsRepisitory {
  async createDeviceSession(
    sessionData: SecurityDeviceDBType,
  ): Promise<string> {
    const result = await securityDevicesCollection.insertOne(sessionData);
    return result.insertedId.toString();
  }
  async updateLastActiveDate(
    deviceId: string,
    refreshTokenCreationDate: Date,
    userId: string,
  ): Promise<boolean> {
    const isLastActiveTimeUpdated = await securityDevicesCollection.updateOne(
      { _id: new ObjectId(deviceId), userId: new ObjectId(userId) },
      { $set: { lastActiveDate: refreshTokenCreationDate } },
    );
    return isLastActiveTimeUpdated.matchedCount > 0;
  }
  async deleteSessionByDeviceAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await securityDevicesCollection.deleteOne({
      userId: new ObjectId(userId),
      _id: new ObjectId(deviceId),
    });
    return result.deletedCount > 0;
  }
  async isAllOtherSessionsDeleted(
    userId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    const result = await securityDevicesCollection.deleteMany({
      userId: new ObjectId(userId),
      _id: { $ne: new ObjectId(currentDeviceId) },
    });
    return result.deletedCount > 0;
  }
}

export const securityDevicesCommandsRepository =
  new SecurityDevicesCommandsRepisitory();
