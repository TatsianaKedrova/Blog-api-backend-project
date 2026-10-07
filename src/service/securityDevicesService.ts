import { ObjectId } from "mongodb";
import { SecurityDevicesCommandsRepository } from "../repositories/commands-repository/securityDevicesCommandsRepository";
import { SecurityDeviceDBType } from "../dto/securityDevicesDTO/securityDevicesDTO";

export class SecurityDevicesService {
  constructor(
    protected readonly securityDevicesCommandsRepository: SecurityDevicesCommandsRepository,
  ) {}
  async createDeviceSession(
    clientIP: string,
    deviceTitle: string,
    userId: string,
  ): Promise<string> {
    const tokenCreationDate = new Date(); // The token generation date
    const refreshTokenExpirationDate = new Date(
      tokenCreationDate.getTime() + 30 * 60 * 1000,
    );
    const newSession = new SecurityDeviceDBType({
      ip: clientIP,
      title: deviceTitle,
      lastActiveDate: tokenCreationDate,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
      userId: new ObjectId(userId),
    });
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
    const updateDeviceLastActiveDate =
      await this.securityDevicesCommandsRepository.updateLastActiveDate(
        deviceId,
        refreshTokenCreationDate,
        userId,
      );
    return updateDeviceLastActiveDate;
  }
}
