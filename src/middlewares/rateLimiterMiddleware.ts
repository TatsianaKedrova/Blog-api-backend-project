import { NextFunction, Request, Response } from "express";
import { createAppError } from "../utils/appErrors";
import { StatusCodes } from "http-status-codes";
import { ApiCallsService } from "../service/apiCallsService";

export const createRateLimiterMiddleware =
  (apiCallsService: ApiCallsService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    const clientIp = req.ip;
    if (!clientIp) {
      throw createAppError(
        "Security block: Unable to securely verify connection identity.",
        StatusCodes.BAD_REQUEST,
      );
    }
    const isRequestAllowed = await apiCallsService.checkIpRequestCount(
      url,
      clientIp,
    );
    if (!isRequestAllowed) {
      throw createAppError(
        "Api calls exceeded the rate limit",
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }
    console.log("Request allowed");
    next();
  };
