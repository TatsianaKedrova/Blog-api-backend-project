import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import express from "express";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { usersController } from "../inversify.config";
import { userRegistrationValidator } from "../utils/validators/authValidator";
export const usersRouter = express.Router({});

usersRouter.get(
  "/",
  basicAuthMiddleware,
  usersController.getAllUsers.bind(usersController),
);
usersRouter.post(
  "/",
  basicAuthMiddleware,
  userRegistrationValidator,
  responseErrorValidationMiddleware,
  usersController.addNewUserBySuperAdmin.bind(usersController),
);
usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  usersController.deleteUser.bind(usersController),
);
