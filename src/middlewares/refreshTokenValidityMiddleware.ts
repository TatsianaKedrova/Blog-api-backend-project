import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../globals/jwt-service";
import { ObjectId } from "mongodb";
import { authQueryRepository } from "../repositories/query-repository/authQueryRepository";
import { createAppError } from "../utils/appErrors";
import { securityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";

export const refreshTokenValidityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshTokenFromClient: string = req.cookies.refreshToken;
  if (!refreshTokenFromClient || !refreshTokenFromClient.trim()) {
    throw createAppError(
      "Refresh token is missing from requests cookies",
      StatusCodes.UNAUTHORIZED,
    );
  }
  const refreshTokenJWTPayloadResult = await jwtService.getJwtPayloadResult(
    refreshTokenFromClient,
    process.env.REFRESH_TOKEN_SECRET as string,
  );
  if (!refreshTokenJWTPayloadResult) {
    throw createAppError(
      "Invalid or expired refresh token",
      StatusCodes.UNAUTHORIZED,
    );
  }
  // refreshTokenJWTPayloadResult?.deviceId
  const activeSession =
    await securityDevicesQueryRepository.findSessionByDeviceId(
      refreshTokenJWTPayloadResult?.deviceId,
    );
  if (!activeSession) {
    throw createAppError(
      "Session has been terminated remotely",
      StatusCodes.UNAUTHORIZED,
    );
  }
  const checkRefreshTokenIsBlacklisted =
    await authQueryRepository.findBlacklistedUserRefreshTokenById(
      new ObjectId(refreshTokenJWTPayloadResult.userId),
      refreshTokenFromClient,
    );

  if (checkRefreshTokenIsBlacklisted) {
    res.clearCookie("refreshToken");
    throw createAppError(
      "Access denied due to security validation failure",
      StatusCodes.UNAUTHORIZED,
    );
  }
  req.userId = refreshTokenJWTPayloadResult.userId;
  req.currentDeviceId = refreshTokenJWTPayloadResult.deviceId;
  return next();
};
