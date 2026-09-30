import { refreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";
import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/authValidator";
import {
  confirmRegistration,
  getInfoAboutUser,
  logIn,
  logout,
  refreshTokenFunction,
  registerUser,
  resendRegistrationEmail,
} from "../controllers/authController";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { confirmationCodeValidator } from "../utils/usersUtils/confirmationCodeValidator";
import { emailValidator } from "../utils/usersUtils/emailValidator";
import { rateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authValidator,
  responseErrorValidationMiddleware,
  rateLimiterMiddleware,
  logIn,
);

authRouter.get("/me", accessTokenValidityMiddleware, getInfoAboutUser);

authRouter.post(
  "/registration",
  rateLimiterMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  registerUser,
);
authRouter.post(
  "/registration-confirmation",
  confirmationCodeValidator,
  responseErrorValidationMiddleware,
  rateLimiterMiddleware,
  confirmRegistration,
);
authRouter.post(
  "/registration-email-resending",
  rateLimiterMiddleware,
  emailValidator,
  responseErrorValidationMiddleware,
  resendRegistrationEmail,
);

authRouter.post(
  "/refresh-token",
  refreshTokenValidityMiddleware,
  refreshTokenFunction,
);

authRouter.post("/logout", refreshTokenValidityMiddleware, logout);
