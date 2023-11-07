import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";

export const checkCookieValidityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshTokenFromClient = req.cookies.refresh_token;
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
  } else if (jwtRefreshTokenPayload && jwtRefreshTokenPayload.userId) {
    req.userId = jwtRefreshTokenPayload.userId;
    next();
  }
};
