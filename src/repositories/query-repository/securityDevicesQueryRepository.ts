import {
  DeviceViewModel,
  SecurityDeviceDBType,
} from "../../dto/securityDevicesDTO/securityDevicesDTO";
import { injectable } from "inversify";
import { SecurityDeviceModel } from "../../db/mongoose/models/sessions.model";

@injectable()
export class SecurityDevicesQueryRepository {
  async getActiveSessions(userId: string): Promise<DeviceViewModel[]> {
    const allActiveSessions = await SecurityDeviceModel.find({
      userId,
    })
      .sort({ refreshTokenExpirationDate: -1 })
      .lean();
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
    const foundDeviceSession =
      await SecurityDeviceModel.findById(deviceId).lean();
    return foundDeviceSession;
  }
}
