import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/authValidator";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { confirmationCodeValidator } from "../utils/usersUtils/confirmationCodeValidator";
import { emailValidator } from "../utils/usersUtils/emailValidator";
import { rateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware";
import {
  authController,
  refreshTokenValidityMiddleware,
} from "../composition-route";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  rateLimiterMiddleware,
  authValidator,
  responseErrorValidationMiddleware,
  authController.logIn.bind(authController),
);

authRouter.get(
  "/me",
  accessTokenValidityMiddleware,
  authController.getInfoAboutUser.bind(authController),
);

authRouter.post(
  "/registration",
  rateLimiterMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  authController.registerUser.bind(authController),
);
authRouter.post(
  "/registration-confirmation",
  rateLimiterMiddleware,
  confirmationCodeValidator,
  responseErrorValidationMiddleware,
  authController.confirmRegistration.bind(authController),
);
authRouter.post(
  "/registration-email-resending",
  rateLimiterMiddleware,
  emailValidator,
  responseErrorValidationMiddleware,
  authController.resendRegistrationEmail.bind(authController),
);

authRouter.post(
  "/refresh-token",
  refreshTokenValidityMiddleware,
  authController.refreshTokenFunction.bind(authController),
);

authRouter.post(
  "/logout",
  refreshTokenValidityMiddleware,
  authController.logout.bind(authController),
);
