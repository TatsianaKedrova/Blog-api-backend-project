import { TFieldError } from "../dto/common/ErrorResponseModel";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { IncorrectConfirmationCodeError } from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import { UserIsConfirmedError } from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import { ConfirmationCodeExpiredError } from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import { EmailAlreadyConfirmedError } from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";
import { WrongEmailError } from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import { ObjectId } from "mongodb";
import {
  AccessToken,
  NewPasswordRecoveryInputModel,
  RefreshToken,
  TokenPairResponse,
} from "../dto/authDTO/authDTO";
import { UsersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import {
  createAccessRefreshTokensResponse,
  getTokenCreationDate,
} from "../utils/jwt/jwtUtils";
import { AuthCommandsRepository } from "../repositories/commands-repository/authCommandsRepository";
import { SecurityDevicesService } from "./securityDevicesService";
import { inject, injectable } from "inversify";
import { TYPES } from "../constants/tokens";
import { createEmailManager } from "../globals/email/email-manager";
import { generateHashedToken } from "../utils/crypto/cryptoUtils";
import { generateJWTHash } from "../globals/bcrypt/bcryptService";

@injectable()
export class AuthService {
  constructor(
    @inject(AuthCommandsRepository)
    private readonly authCommandsRepository: AuthCommandsRepository,
    @inject(UsersCommandsRepository)
    private readonly usersCommandsRepository: UsersCommandsRepository,
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
    @inject(SecurityDevicesService)
    protected readonly securityDevicesService: SecurityDevicesService,
    @inject(TYPES.EmailManager)
    protected readonly emailManager: ReturnType<typeof createEmailManager>,
  ) {}
  async confirmCode(code: string): Promise<TFieldError | string> {
    const user =
      await this.usersQueryRepository.findUserByConfirmationCode(code);
    if (!user || user?.emailConfirmation.confirmationCode !== code) {
      return new IncorrectConfirmationCodeError();
    }
    if (user?.emailConfirmation.isConfirmed) {
      return new UserIsConfirmedError();
    }
    if (
      user?.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date()
    ) {
      return new ConfirmationCodeExpiredError();
    }
    await this.usersCommandsRepository.updateUserIsConfirmed(user._id);
    return user.accountData.login;
  }
  async resendEmail(email: string): Promise<TFieldError | string> {
    const user = await this.usersQueryRepository.findUserByEmail(email);
    if (!user) {
      return new WrongEmailError();
    }
    if (user.emailConfirmation.isConfirmed) {
      return new EmailAlreadyConfirmedError();
    }
    await this.emailManager.resendEmailWithCode(user);
    return user.accountData.email;
  }
  async loginAndSessionCreate(
    clientIP: string,
    deviceTitle: string,
    userId: string,
  ): Promise<TokenPairResponse> {
    //Getting IP and Device name during LOGIN
    const deviceId = await this.securityDevicesService.createDeviceSession(
      clientIP,
      deviceTitle,
      userId,
    );
    const { accessToken, refreshToken } = createAccessRefreshTokensResponse(
      userId,
      deviceId,
    );
    return {
      accessToken: accessToken as AccessToken,
      refreshToken: refreshToken as RefreshToken,
    };
  }
  async createRefreshTokenBlacklistForUser(
    userId: ObjectId,
  ): Promise<string | null> {
    return await this.authCommandsRepository.createUserRefreshTokensBlacklist(
      userId,
    );
  }
  async placeRefreshTokenToBlacklist(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    return await this.authCommandsRepository.putRefreshTokenToBlacklist(
      refreshToken,
      userId,
    );
  }
  async refreshSession(
    oldRefreshToken: string,
    userId: string,
    currentDeviceId: string,
  ): Promise<TokenPairResponse> {
    await this.placeRefreshTokenToBlacklist(oldRefreshToken, userId);
    const { accessToken, refreshToken } = createAccessRefreshTokensResponse(
      userId,
      currentDeviceId,
    );
    const newTokenCreationDate = getTokenCreationDate(refreshToken);
    await this.securityDevicesService.updateLastActiveDate(
      currentDeviceId,
      newTokenCreationDate,
      userId,
    );
    return {
      accessToken: accessToken as AccessToken,
      refreshToken: refreshToken as RefreshToken,
    };
  }
  async sendPasswordCode(email: string) {
    const user = await this.usersQueryRepository.findUserByEmail(email);
    if (!user) {
      return;
    }
    await this.emailManager.sendPasswordRecoveryLetter(user._id, email);
  }
  async createNewPassword(
    data: NewPasswordRecoveryInputModel,
  ): Promise<boolean> {
    const { newPassword, recoveryCode } = data;
    const hashedToken = generateHashedToken(recoveryCode);
    const { passwordSalt, passwordHash } = await generateJWTHash(newPassword);

    return await this.usersCommandsRepository.updatePasswordByResetHash(
      hashedToken,
      passwordSalt,
      passwordHash,
    );
  }
}
