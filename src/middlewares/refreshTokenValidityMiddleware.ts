import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { createAppError } from "../utils/appErrors";
import { securityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";
import { getJwtPayloadResult } from "../globals/jwt-service";
import { getClearCookieOptions } from "../utils/auth-utils/cookie";
import { authQueryRepository } from "../repositories/query-repository/authQueryRepository";

export const refreshTokenValidityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshTokenFromClient: string | undefined = req.cookies?.refreshToken;
  if (!refreshTokenFromClient || !refreshTokenFromClient.trim()) {
    throw createAppError(
      "Refresh token is missing from requests cookies",
      StatusCodes.UNAUTHORIZED,
    );
  }
  const refreshTokenJWTPayloadResult = getJwtPayloadResult(
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
    res.clearCookie("refreshToken", getClearCookieOptions());
    throw createAppError(
      "Access denied due to security validation failure",
      StatusCodes.UNAUTHORIZED,
    );
  }
  req.userId = refreshTokenJWTPayloadResult.userId;
  req.currentDeviceId = refreshTokenJWTPayloadResult.deviceId;
  return next();
};
