import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import { SessionDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";

export const securityDevicesCommandsRepository = {
  async createDeviceSession(
    sessionData: Omit<SessionDeviceDBType, "_id">,
  ): Promise<string> {
    const result = await securityDevicesCollection.insertOne({
      _id: new ObjectId(),
      ...sessionData,
    });
    return result.insertedId.toString();
  },
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
  },
  async deleteSessionByDeviceAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await securityDevicesCollection.deleteOne({
      userId: new ObjectId(userId),
      _id: new ObjectId(deviceId),
    });
    return result.deletedCount > 0;
  },
  async isAllOtherSessionsDeleted(
    userId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    const result = await securityDevicesCollection.deleteMany({
      userId: new ObjectId(userId),
      deviceId: { $ne: currentDeviceId },
    });
    return result.deletedCount > 0;
  },
};
