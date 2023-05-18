import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";

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
    const foundUser = await usersCommandsRepository.findUserById(
      userId.toString()
    );
    if (foundUser) {
      req.user = foundUser;
      next();
    } else {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};
