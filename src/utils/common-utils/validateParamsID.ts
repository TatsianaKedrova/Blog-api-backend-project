import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

export const validateParamsID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    next();
  } else {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }
};
