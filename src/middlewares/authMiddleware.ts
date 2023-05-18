import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let authValue = req.headers.authorization;
  if (!authValue || authValue.split(" ")[0].toLowerCase() !== "bearer") {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const token = authValue.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.userId = userId.toString();
    next();
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};
