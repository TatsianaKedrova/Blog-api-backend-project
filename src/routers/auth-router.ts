import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/auth-validator";
import { getInfoAboutUser, logIn } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authValidator,
  responseErrorValidationMiddleware,
  logIn
);

authRouter.get("/me", authMiddleware, getInfoAboutUser);
