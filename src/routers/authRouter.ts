import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  userRegistrationValidator,
  loginValidator,
  passwordResetValidator,
  emailValidator,
  confirmationCodeValidator,
} from "../utils/validators/authValidator";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import {
  authController,
  rateLimiterMiddleware,
  refreshTokenValidityMiddleware,
} from "../inversify.config";
export const authRouter = express.Router({});

authRouter.post(
  "/password-recovery",
  rateLimiterMiddleware,
  emailValidator,
  responseErrorValidationMiddleware,
  authController.recoverPassword.bind(authController),
);

authRouter.post(
  "/new-password",
  rateLimiterMiddleware,
  passwordResetValidator,
  responseErrorValidationMiddleware,
  authController.createNewPassword.bind(authController),
);

authRouter.post(
  "/login",
  loginValidator,
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
  userRegistrationValidator,
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
