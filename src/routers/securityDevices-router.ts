import express from "express";
import { refreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { securityDevicesController } from "../controllers/securityDevicesController";
export const securityDevicesRouter = express.Router({});

/**returns all devices with active sessions for current user*/
securityDevicesRouter.get(
  "/",
  refreshTokenValidityMiddleware,
  securityDevicesController.getAllActiveSessions.bind(
    securityDevicesController,
  ),
);

/**terminate all other (excluding current) device sessions*/
securityDevicesRouter.delete(
  "/",
  refreshTokenValidityMiddleware,
  securityDevicesController.terminateAllSessionsExceptCurrent.bind(
    securityDevicesController,
  ),
);

/**terminate specified device session*/
securityDevicesRouter.delete(
  "/:id",
  validateObjectIdMiddleware,
  refreshTokenValidityMiddleware,
  securityDevicesController.terminateSessionById.bind(
    securityDevicesController,
  ),
);
