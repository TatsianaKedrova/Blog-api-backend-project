import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { ObjectId } from "mongodb";
import { authQueryRepository } from "../repositories/query-repository/authQueryRepository";

export const checkRefreshTokenValidityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshTokenFromClient = req.cookies.refreshToken;
  if (!refreshTokenFromClient || !refreshTokenFromClient.trim()) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  const jwtRefreshTokenPayload = await jwtService.getJwtPayloadResult(
    refreshTokenFromClient,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  if (!jwtRefreshTokenPayload) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  } else if (jwtRefreshTokenPayload) {
    const checkRefreshTokenIsNotBlacklisted =
      await authQueryRepository.findBlacklistedUserRefreshTokenById(
        new ObjectId(jwtRefreshTokenPayload.userId),
        refreshTokenFromClient
      );
    if (checkRefreshTokenIsNotBlacklisted) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    } else {
      req.userId = jwtRefreshTokenPayload.userId;
      next();
    }
  }
};
