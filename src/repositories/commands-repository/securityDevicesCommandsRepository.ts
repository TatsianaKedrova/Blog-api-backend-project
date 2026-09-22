import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import { SessionDeviceDBType } from "../../dto/securityDevicesDTO/securityDevicesDTO";

export const securityDevicesCommandsRepository = {
  async createDeviceSession(
    sessionData: SessionDeviceDBType,
  ): Promise<boolean> {
    try {
      const result = await securityDevicesCollection.insertOne(sessionData);
      return result.acknowledged;
    } catch (error) {
      console.error("Failed to insert device session:", error);
      return false;
    }
  },
  async deleteSessionByDeviceAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await securityDevicesCollection.deleteOne({
      userId: new ObjectId(userId),
      deviceId: deviceId,
    });
    return result.deletedCount > 0;
  },
};
