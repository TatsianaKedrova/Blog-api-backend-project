import { ObjectId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import { DeviceViewModel } from "../../dto/securityDevicesDTO/securityDevicesDTO";

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
        deviceId: session.deviceId,
      }));
    } catch (error) {
      console.error(
        `Failed to fetch active sessions for user ${userId}:`,
        error,
      );
      return []; // Return an empty array on failure instead of undefined to avoid crashes upstream
    }
  },
};
