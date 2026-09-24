import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import {
  DeviceViewModel,
  SessionDeviceDBType,
} from "../../dto/securityDevicesDTO/securityDevicesDTO";

export const securityDevicesQueryRepository = {
  async getActiveSessions(userId: string): Promise<DeviceViewModel[] | []> {
    try {
      const allActiveSessions = await securityDevicesCollection
        .find({ userId: new ObjectId(userId) })
        .toArray();
      return allActiveSessions.map((session) => ({
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.lastActiveDate.toISOString(),
        deviceId: session._id.toString(),
      }));
    } catch (error) {
      console.error(
        `Failed to fetch active sessions for user ${userId}:`,
        error,
      );
      return [];
    }
  },
  async findSessionByDeviceId(
    deviceId: string,
  ): Promise<SessionDeviceDBType | null> {
    try {
      if (!ObjectId.isValid(deviceId)) {
        return null;
      }
      const foundDeviceSession = await securityDevicesCollection.findOne({
        _id: new ObjectId(deviceId),
      });
      return foundDeviceSession;
    } catch (error) {
      console.error("Database error in findSessionByDeviceId:", error);
      throw error;
    }
  },
};
