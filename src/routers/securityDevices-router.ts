import express from "express";
import { getAllActiveSessions } from "../controllers/securityDevicesController";
export const securityDevicesRouter = express.Router();

securityDevicesRouter.get("/devices", getAllActiveSessions);
