import express from "express";
import {
  getAllActiveSessions,
  terminateAllOtherSessions,
  terminateSessionById,
} from "../controllers/securityDevicesController";
import { refreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
export const securityDevicesRouter = express.Router({});

/**returns all devices with active sessions for current user*/
securityDevicesRouter.get(
  "/",
  refreshTokenValidityMiddleware,
  getAllActiveSessions,
);

/**terminate all other (excluding current) device sessions*/
securityDevicesRouter.delete(
  "/",
  refreshTokenValidityMiddleware,
  terminateAllOtherSessions,
);

/**terminate specified device session*/
securityDevicesRouter.delete(
  "/:id",
  validateObjectIdMiddleware,
  refreshTokenValidityMiddleware,
  terminateSessionById,
);
