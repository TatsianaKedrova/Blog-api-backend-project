import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import { SessionDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";

export const securityDevicesCommandsRepository = {
  async createDeviceSession(
    sessionData: Omit<SessionDeviceDBType, "_id">,
  ): Promise<string> {
    try {
      const result = await securityDevicesCollection.insertOne({
        _id: new ObjectId(),
        ...sessionData,
      });
      return result.insertedId.toString();
    } catch (error) {
      console.error("Failed to insert device session:", error);
      throw error;
    }
  },
  async updateLastActiveDate(
    deviceId: string,
    refreshTokenCreationDate: Date,
    userId: string,
  ): Promise<boolean> {
    try {
      const isLastActiveTimeUpdated = await securityDevicesCollection.updateOne(
        { _id: new ObjectId(deviceId), userId: new ObjectId(userId) },
        { $set: { lastActiveDate: refreshTokenCreationDate } },
      );
      return isLastActiveTimeUpdated.matchedCount > 0;
    } catch (error) {
      console.log("System database error occurred");
      throw error;
    }
  },
  async deleteSessionByDeviceAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const result = await securityDevicesCollection.deleteOne({
        userId: new ObjectId(userId),
        _id: new ObjectId(deviceId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Failed to delete device session:", error);
      throw error;
    }
  },
};
