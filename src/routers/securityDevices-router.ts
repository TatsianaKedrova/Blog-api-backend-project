import express from "express";
import {
  getAllActiveSessions,
  terminateAllOtherSessions,
  terminateSpecificSession,
} from "../controllers/securityDevicesController";
export const securityDevicesRouter = express.Router();

/**returns all devices with active sessions for current user*/
securityDevicesRouter.get("/", getAllActiveSessions);

/**terminate all other (excluding current) device sessions*/
securityDevicesRouter.delete("/", terminateAllOtherSessions);

/**terminate specified device session*/
securityDevicesRouter.delete("/:id", terminateSpecificSession);
