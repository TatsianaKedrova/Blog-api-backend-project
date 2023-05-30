import express from "express";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
} from "../controllers/usersController";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { validateObjectIdParams } from "../middlewares/validateObjectIdParams";
export const usersRouter = express.Router({});

usersRouter.get("/", basicAuthMiddleware, getAllUsers as any);
usersRouter.post(
  "/",
  basicAuthMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  addNewUser
);
usersRouter.delete("/:id", basicAuthMiddleware, validateObjectIdParams, deleteUser);
