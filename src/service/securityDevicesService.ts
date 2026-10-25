import { SecurityDevicesCommandsRepository } from "../repositories/commands-repository/securityDevicesCommandsRepository";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { createExpirationDate } from "../utils/date/dateUtils";
import { SecurityDeviceDBType } from "../dto/securityDevicesDTO/securityDevicesDTO";

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(SecurityDevicesCommandsRepository)
    protected readonly securityDevicesCommandsRepository: SecurityDevicesCommandsRepository,
  ) {}
  async createDeviceSession(
    clientIP: string,
    deviceTitle: string,
    userId: string,
  ): Promise<string> {
    const tokenCreationDate = new Date(); // The token generation date
    const refreshTokenExpirationDate = createExpirationDate({ minutes: 30 });
    const newSession: Omit<SecurityDeviceDBType, "_id"> = {
      ip: clientIP,
      title: deviceTitle,
      lastActiveDate: tokenCreationDate,
      refreshTokenExpirationDate,
      userId: new Types.ObjectId(userId),
    };
    const deviceId =
      await this.securityDevicesCommandsRepository.createDeviceSession(
        newSession,
      );
    return deviceId;
  }
  async deleteSessionById(deviceId: string, userId: string): Promise<boolean> {
    const result =
      await this.securityDevicesCommandsRepository.deleteSessionByDeviceAndUserId(
        deviceId,
        userId,
      );
    return result;
  }
  async deleteAllSessionsExceptCurrent(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    await this.securityDevicesCommandsRepository.isAllOtherSessionsDeleted(
      userId,
      currentDeviceId,
    );
  }
  async updateLastActiveDate(
    deviceId: string,
    refreshTokenCreationDate: Date,
    userId: string,
  ): Promise<boolean> {
    const refreshTokenExpirationDate = createExpirationDate({ minutes: 30 });

    const updateDeviceLastActiveDate =
      await this.securityDevicesCommandsRepository.updateLastActiveDate(
        deviceId,
        userId,
        refreshTokenCreationDate,
        refreshTokenExpirationDate,
      );
    return updateDeviceLastActiveDate;
  }
}
