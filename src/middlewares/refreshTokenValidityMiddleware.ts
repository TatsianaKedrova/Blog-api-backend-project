import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { ObjectId } from "mongodb";
import { authQueryRepository } from "../repositories/query-repository/authQueryRepository";
import { securityDevicesService } from "../domain/securityDevices-service";
import { createAppError } from "../utils/appErrors";

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
  } else {
    const checkRefreshTokenIsBlacklisted =
      await authQueryRepository.findBlacklistedUserRefreshTokenById(
        new ObjectId(refreshTokenJWTPayloadResult.userId),
        refreshTokenFromClient,
      );
    if (checkRefreshTokenIsBlacklisted) {
      await securityDevicesService.deleteSessionById(
        refreshTokenJWTPayloadResult.deviceId,
        refreshTokenJWTPayloadResult.userId,
      );
      res.clearCookie("refreshToken");
      console.warn(
        `🚨 [SECURITY BREACH]: Token reuse attempt! User ID: ${refreshTokenJWTPayloadResult.userId} | Device ID: ${refreshTokenJWTPayloadResult.deviceId}. Session revoked.`,
      );
      throw createAppError(
        "Access denied due to security validation failure",
        StatusCodes.FORBIDDEN,
      );
    } else {
      req.userId = refreshTokenJWTPayloadResult.userId;
      req.currentDeviceId = refreshTokenJWTPayloadResult.deviceId;
      return next();
    }
  }
};
