import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithURIParam } from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { Types } from "mongoose";

/** This middleware should be added only for MongoDB,
 *  cos' it check the validity of ObjectId
 */
export const validateObjectIdMiddleware = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (Types.ObjectId.isValid(id)) {
    next();
  } else {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }
};
