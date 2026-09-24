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
