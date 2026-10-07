import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import {
  DeviceViewModel,
  SecurityDeviceDBType,
} from "../../dto/securityDevicesDTO/securityDevicesDTO";

export class SecurityDevicesQueryRepository {
  async getActiveSessions(userId: string): Promise<DeviceViewModel[]> {
    const allActiveSessions = await securityDevicesCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ _id: 1 })
      .toArray();
    if (allActiveSessions.length === 0) {
      return [];
    }
    return allActiveSessions.map((session) => ({
      ip: session.ip,
      title: session.title,
      lastActiveDate: session.lastActiveDate.toISOString(),
      deviceId: session._id.toString(),
    }));
  }
  async findSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDeviceDBType | null> {
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
  }
}
