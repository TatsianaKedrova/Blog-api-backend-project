import { ObjectId } from "mongodb";
import { securityDevicesCommandsRepository } from "../repositories/commands-repository/securityDevicesCommandsRepository";

export const securityDevicesService = {
  async createDeviceSession(
    clientIP: string,
    deviceTitle: string,
    userId: string,
  ): Promise<string> {
    const tokenCreationDate = new Date(); // The token generation date
    const refreshTokenExpirationDate = new Date(
      tokenCreationDate.getTime() + 30 * 60 * 1000,
    );
    const sessionData = {
      ip: clientIP,
      title: deviceTitle,
      lastActiveDate: tokenCreationDate,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
      userId: new ObjectId(userId),
    };
    const deviceId =
      await securityDevicesCommandsRepository.createDeviceSession(sessionData);
    return deviceId;
  },
  async deleteSession(deviceId: string, userId: string): Promise<boolean> {
    return await securityDevicesCommandsRepository.deleteSessionByDeviceAndUserId(
      deviceId,
      userId,
    );
  },
};
