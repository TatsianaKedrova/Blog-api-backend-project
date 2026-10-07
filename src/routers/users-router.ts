import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import express from "express";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { usersController } from "../composition-route";
export const usersRouter = express.Router({});

usersRouter.get(
  "/",
  basicAuthMiddleware,
  usersController.getAllUsers.bind(usersController),
);
usersRouter.post(
  "/",
  basicAuthMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  usersController.addNewUserBySuperAdmin.bind(usersController),
);
usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  usersController.deleteUser.bind(usersController),
);
