import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/auth-validator";
import { getInfoAboutUser, logIn, registerUser } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createUserValidator } from "../utils/usersUtils/users-validator";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authValidator,
  responseErrorValidationMiddleware,
  logIn
);

authRouter.get("/me", authMiddleware, getInfoAboutUser);

authRouter.post("/registration", createUserValidator, registerUser);