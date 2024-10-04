import { Request, Response } from "express";
import { DeviceViewModel } from "../dto/securityDevicesDTO/securityDevicesDTO";
import { StatusCodes } from "http-status-codes";
import { securityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";

export const getAllActiveSessions = async (
  req: Request,
  res: Response<DeviceViewModel[] | undefined>
) => {
  const allActiveSessions: DeviceViewModel[] | undefined =
    await securityDevicesQueryRepository.getActiveSessions();
  res.status(StatusCodes.OK).send(allActiveSessions);
};

export const terminateAllOtherSessions = () => {};

export const terminateSessionById = () => {};
