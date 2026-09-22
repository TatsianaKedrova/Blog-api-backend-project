import { securityDevicesCommandsRepository } from "../repositories/commands-repository/securityDevicesCommandsRepository";

export const securityDevicesService = {
  async createDeviceSession(
    clientIP: string,
    deviceTitle: string,
    userId: string,
  ): Promise<any> {
    const deviceId = crypto.randomUUID(); // Unique ID for this specific session
    const tokenCreationDate = new Date(); // The token generation date
    const refreshTokenExpirationDate = new Date(
      tokenCreationDate.getTime() + 30 * 60 * 1000,
    );
    const sessionData = {
      ip: clientIP,
      title: deviceTitle,
      lastActiveDate: tokenCreationDate,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
      deviceId: deviceId,
      userId: userId,
    };
    const isSessionCreated =
      await securityDevicesCommandsRepository.createDeviceSession(sessionData);
    return isSessionCreated;
  },
};
