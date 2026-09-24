import { Request, Response } from "express";
import { DeviceViewModel } from "../dto/securityDevicesDTO/securityDevicesDTO";
import { StatusCodes } from "http-status-codes";
import { securityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";
import { RequestWithURIParam } from "../dto/common/RequestModels";
import { securityDevicesService } from "../domain/securityDevices-service";
import { createAppError } from "../utils/appErrors";

export const getAllActiveSessions = async (
  req: Request,
  res: Response<DeviceViewModel[] | undefined>,
) => {
  const allActiveSessions: DeviceViewModel[] | undefined =
    await securityDevicesQueryRepository.getActiveSessions(req.userId);
  res.status(StatusCodes.OK).send(allActiveSessions);
};

export const terminateAllOtherSessions = () => {};

export const terminateSessionById = async (
  req: RequestWithURIParam<{ deviceId: string }>,
  res: Response,
) => {
  const deviceIdToDelete = req.params.deviceId;
  const userId = req.userId;
  const currentDeviceId = req.currentDeviceId;
  if (currentDeviceId === deviceIdToDelete) {
    throw createAppError(
      "Cannot terminate your current active session. Use logout instead.",
      StatusCodes.BAD_REQUEST,
    );
  }
  const result = await securityDevicesService.deleteSessionById(
    deviceIdToDelete,
    userId,
  );
  if (!result) {
    const sessionExistsAnywhere =
      await securityDevicesQueryRepository.findSessionByDeviceId(
        deviceIdToDelete,
      );

    if (!sessionExistsAnywhere) {
      throw createAppError("Session not found", StatusCodes.NOT_FOUND);
    }

    // The session exists under another user, so it's a security barrier violation
    throw createAppError(
      "You do not have permission to delete this session",
      StatusCodes.FORBIDDEN,
    );
  }
  res.status(StatusCodes.NO_CONTENT);
};
