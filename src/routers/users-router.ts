import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import express from "express";
import { usersController } from "../controllers/usersController";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
export const usersRouter = express.Router({});

usersRouter.get("/", basicAuthMiddleware, usersController.getAllUsers);
usersRouter.post(
  "/",
  basicAuthMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  usersController.addNewUserBySuperAdmin,
);
usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  usersController.deleteUser,
);
