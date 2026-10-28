import {
  DeviceViewModel,
  SecurityDeviceDBType,
} from "../../dto/securityDevicesDTO/securityDevicesDTO";
import { inject, injectable } from "inversify";
import { SecurityDeviceModel } from "../../db/mongoose/models/sessions.model";
import { Model } from "mongoose";

@injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @inject(SecurityDeviceModel)
    private readonly securityDeviceModel: Model<SecurityDeviceDBType>,
  ) {}
  async getActiveSessions(userId: string): Promise<DeviceViewModel[]> {
    const allActiveSessions = await this.securityDeviceModel
      .find({
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
    const foundDeviceSession = await this.securityDeviceModel
      .findById(deviceId)
      .lean();
    return foundDeviceSession;
  }
}
