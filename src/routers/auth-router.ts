import { refreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";
import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/authValidator";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { confirmationCodeValidator } from "../utils/usersUtils/confirmationCodeValidator";
import { emailValidator } from "../utils/usersUtils/emailValidator";
import { rateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware";
import { authController } from "../controllers/authController";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  rateLimiterMiddleware,
  authValidator,
  responseErrorValidationMiddleware,
  authController.logIn,
);

authRouter.get(
  "/me",
  accessTokenValidityMiddleware,
  authController.getInfoAboutUser,
);

authRouter.post(
  "/registration",
  rateLimiterMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  authController.registerUser,
);
authRouter.post(
  "/registration-confirmation",
  rateLimiterMiddleware,
  confirmationCodeValidator,
  responseErrorValidationMiddleware,
  authController.confirmRegistration,
);
authRouter.post(
  "/registration-email-resending",
  rateLimiterMiddleware,
  emailValidator,
  responseErrorValidationMiddleware,
  authController.resendRegistrationEmail,
);

authRouter.post(
  "/refresh-token",
  refreshTokenValidityMiddleware,
  authController.refreshTokenFunction,
);

authRouter.post(
  "/logout",
  refreshTokenValidityMiddleware,
  authController.logout,
);
