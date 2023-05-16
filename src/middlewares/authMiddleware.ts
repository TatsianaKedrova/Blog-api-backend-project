import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debugger;
  let authValue = req.headers.authorization;
  if (!authValue || authValue.split(" ")[0].toLowerCase() !== "bearer") {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const token = authValue.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = await usersCommandsRepository.findUserById(userId.toString());
    next();
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};
