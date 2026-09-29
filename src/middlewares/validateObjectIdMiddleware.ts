import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { RequestWithURIParam } from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";

/** This middleware should be added only for MongoDB,
 *  cos' it check the validity of ObjectId
 */
export const validateObjectIdMiddleware = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    next();
  } else {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }
};
