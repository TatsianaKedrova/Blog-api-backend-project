import { ObjectId } from "mongodb";
import { securityDevicesCommandsRepository } from "../repositories/commands-repository/securityDevicesCommandsRepository";
import { authService } from "./auth-service";
import { create_access_refresh_tokens } from "../utils/auth-utils/create_Access_Refresh_Tokens";
import { jwtService } from "../application/jwt-service";
import { createAppError } from "../utils/appErrors";
import { StatusCodes } from "http-status-codes";
import {
  AccessToken,
  RefreshToken,
  TokenPairResponse,
} from "../dto/authDTO/authDTO";

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
  async deleteSessionById(deviceId: string, userId: string): Promise<boolean> {
    const result =
      await securityDevicesCommandsRepository.deleteSessionByDeviceAndUserId(
        deviceId,
        userId,
      );
    return result;
  },
  async refreshSession(
    refreshTokenToBeUpdated: string,
    userId: string,
    currentDeviceId: string,
  ): Promise<TokenPairResponse> {
    const isPlacedToBlacklist = await authService.placeRefreshTokenToBlacklist(
      refreshTokenToBeUpdated,
      userId,
    );
    if (!isPlacedToBlacklist) {
      throw createAppError(
        "Token was not blacklisted",
        StatusCodes.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } = await create_access_refresh_tokens(
      userId,
      currentDeviceId,
    );
    const newTokenCreationDate =
      await jwtService.getTokenCreationDate(refreshToken);
    const deviceLastActivityDateUpdated =
      await securityDevicesService.updateLastActiveDate(
        currentDeviceId,
        newTokenCreationDate,
        userId,
      );
    if (!deviceLastActivityDateUpdated) {
      throw createAppError(
        "Security Device last activity date was not updated",
        StatusCodes.NOT_FOUND,
      );
    }
    return {
      accessToken: accessToken as AccessToken,
      refreshToken: refreshToken as RefreshToken,
    };
  },
  async updateLastActiveDate(
    deviceId: string,
    refreshTokenCreationDate: Date,
    userId: string,
  ): Promise<boolean> {
    const updateDeviceLastActiveDate =
      await securityDevicesCommandsRepository.updateLastActiveDate(
        deviceId,
        refreshTokenCreationDate,
        userId,
      );
    return updateDeviceLastActiveDate;
  },
};
