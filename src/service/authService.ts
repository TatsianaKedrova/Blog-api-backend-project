import { authCommandsRepository } from "../repositories/commands-repository/authCommandsRepository";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { emailManager } from "../globals/email/email-manager";
import { TFieldError } from "../dto/common/ErrorResponseModel";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { IncorrectConfirmationCodeError } from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import { UpdateUserError } from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import { UserIsConfirmedError } from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import { ConfirmationCodeExpiredError } from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import { EmailAlreadyConfirmedError } from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";
import { WrongEmailError } from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import { ObjectId } from "mongodb";
import {
  AccessToken,
  RefreshToken,
  TokenPairResponse,
} from "../dto/authDTO/authDTO";
import { jwtService } from "../globals/jwt-service";
import { securityDevicesService } from "./securityDevicesService";

export const authService = {
  async confirmCode(code: string): Promise<TFieldError | string> {
    const user = await usersQueryRepository.findUserByConfirmationCode(code);
    if (!user || user?.emailConfirmation.confirmationCode !== code) {
      return new IncorrectConfirmationCodeError();
    }
    if (user?.emailConfirmation.isConfirmed) {
      return new UserIsConfirmedError();
    }
    if (
      user?.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date().toISOString()
    ) {
      return new ConfirmationCodeExpiredError();
    } else {
      const updateIsConfirmedUser =
        await usersCommandsRepository.updateUserIsConfirmed(user._id);
      if (!updateIsConfirmedUser) {
        return new UpdateUserError("registration-confirmation");
      }
      return user.accountData.login;
    }
  },
  async resendEmail(email: string): Promise<TFieldError | string> {
    const user = await usersQueryRepository.findUserByEmail(email);
    if (!user) {
      return new WrongEmailError();
    }
    if (user.emailConfirmation.isConfirmed) {
      return new EmailAlreadyConfirmedError();
    }
    const resendEmailResult = await emailManager.resendEmailWithCode(user);
    if (!resendEmailResult) {
      return new UpdateUserError("registration-email-resending");
    }
    return user.accountData.email;
  },
  async loginAndSessionCreate(
    clientIP: string,
    deviceTitle: string,
    userId: string,
  ): Promise<TokenPairResponse> {
    //Getting IP and Device name during LOGIN
    const deviceId = await securityDevicesService.createDeviceSession(
      clientIP,
      deviceTitle,
      userId,
    );
    const { accessToken, refreshToken } =
      await jwtService.createAccessRefreshTokensResponse(userId, deviceId);
    return {
      accessToken: accessToken as AccessToken,
      refreshToken: refreshToken as RefreshToken,
    };
  },
  async createRefreshTokenBlacklistForUser(
    userId: ObjectId,
  ): Promise<string | null> {
    return await authCommandsRepository.createUserRefreshTokensBlacklist(
      userId,
    );
  },
  async placeRefreshTokenToBlacklist(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    return await authCommandsRepository.putRefreshTokenToBlacklist(
      refreshToken,
      userId,
    );
  },
  async refreshSession(
    oldRefreshToken: string,
    userId: string,
    currentDeviceId: string,
  ): Promise<TokenPairResponse> {
    await authService.placeRefreshTokenToBlacklist(oldRefreshToken, userId);
    const { accessToken, refreshToken } =
      await jwtService.createAccessRefreshTokensResponse(
        userId,
        currentDeviceId,
      );
    const newTokenCreationDate =
      await jwtService.getTokenCreationDate(refreshToken);
    await securityDevicesService.updateLastActiveDate(
      currentDeviceId,
      newTokenCreationDate,
      userId,
    );
    return {
      accessToken: accessToken as AccessToken,
      refreshToken: refreshToken as RefreshToken,
    };
  },
};
