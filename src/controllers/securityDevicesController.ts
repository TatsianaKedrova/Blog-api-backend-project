import { Request, Response } from "express";
import { DeviceViewModel } from "../dto/securityDevicesDTO/securityDevicesDTO";
import { StatusCodes } from "http-status-codes";
import { securityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";
import { RequestWithURIParam } from "../dto/common/RequestModels";
import { createAppError } from "../utils/appErrors";
import { SecurityDevicesService } from "../service/securityDevicesService";

class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService = new SecurityDevicesService(),
  ) {}
  async getAllActiveSessions(req: Request, res: Response<DeviceViewModel[]>) {
    const allActiveSessions: DeviceViewModel[] =
      await securityDevicesQueryRepository.getActiveSessions(req.userId);
    res.status(StatusCodes.OK).send(allActiveSessions);
  }
  async terminateAllSessionsExceptCurrent(req: Request, res: Response) {
    const userId = req.userId;
    const currentDeviceId = req.currentDeviceId;
    await this.securityDevicesService.deleteAllSessionsExceptCurrent(
      userId,
      currentDeviceId,
    );
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
  async terminateSessionById(
    req: RequestWithURIParam<{ id: string }>,
    res: Response,
  ) {
    const deviceIdToDelete = req.params.id;
    const userId = req.userId;
    const currentDeviceId = req.currentDeviceId;
    if (currentDeviceId === deviceIdToDelete) {
      throw createAppError(
        "Cannot terminate your current active session. Use logout instead.",
        StatusCodes.BAD_REQUEST,
      );
    }
    const result = await this.securityDevicesService.deleteSessionById(
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
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
}

export const securityDevicesController = new SecurityDevicesController();
