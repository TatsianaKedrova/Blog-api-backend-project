import { getCurrentUserInfo } from "./../utils/auth-utils/getCurrentUserInfo";
import { StatusCodes } from "http-status-codes";
import {
  LoginInputModel,
  MeViewModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
} from "../dto/authDTO/authDTO";
import { RequestBodyModel } from "../dto/common/RequestModels";
import { Request, Response } from "express";
import { UserInputModel } from "../dto/usersDTO/usersDTO";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { responseErrorFunction } from "../utils/common-utils/responseErrorFunction";
import { IncorrectConfirmationCodeError } from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import { UpdateUserError } from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import { UserIsConfirmedError } from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import { ConfirmationCodeExpiredError } from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import { WrongEmailError } from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import { EmailAlreadyConfirmedError } from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";
import { getDeviceTitle } from "../utils/securityDevices-utils/getDeviceTitle";
import { createAppError } from "../utils/appErrors";
import { getCookieOptions } from "../utils/auth-utils/cookie";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { UsersService } from "../service/usersService";
import { AuthService } from "../service/authService";
import { SecurityDevicesService } from "../service/securityDevicesService";

export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    protected readonly usersService: UsersService,
    protected readonly authService: AuthService,
    protected readonly securityDevicesService: SecurityDevicesService,
  ) {}
  async logIn(req: RequestBodyModel<LoginInputModel>, res: Response) {
    const user = await this.usersService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password,
    );
    if (!user) {
      throw createAppError(
        "Invalid login credentials",
        StatusCodes.UNAUTHORIZED,
      );
    }
    const clientIP = req.ip || "127.0.0.1";
    const deviceTitle = getDeviceTitle(req.headers["user-agent"]);
    const userId = user._id.toString();
    const { accessToken, refreshToken } =
      await this.authService.loginAndSessionCreate(
        clientIP,
        deviceTitle,
        userId,
      );
    res.cookie("refreshToken", refreshToken, getCookieOptions());
    return res.status(StatusCodes.OK).send({ accessToken });
  }
  async getInfoAboutUser(req: Request, res: Response<MeViewModel>) {
    const foundUser = await this.usersQueryRepository.findUserById(req.userId);
    if (foundUser) {
      const currentUser = getCurrentUserInfo(foundUser);
      res.status(StatusCodes.OK).send(currentUser);
    } else {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  }
  async registerUser(
    req: RequestBodyModel<UserInputModel>,
    res: Response<TApiErrorResultObject>,
  ) {
    await this.usersService.createUser(req.body, false);
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
  async confirmRegistration(
    req: RequestBodyModel<RegistrationConfirmationCodeModel>,
    res: Response<TApiErrorResultObject>,
  ) {
    const confirmCodeResult = await this.authService.confirmCode(req.body.code);
    if (
      confirmCodeResult instanceof IncorrectConfirmationCodeError ||
      confirmCodeResult instanceof UserIsConfirmedError ||
      confirmCodeResult instanceof ConfirmationCodeExpiredError
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(responseErrorFunction([confirmCodeResult]));
      return;
    }
    if (confirmCodeResult instanceof UpdateUserError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(responseErrorFunction([confirmCodeResult]));
      return;
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
  async resendRegistrationEmail(
    req: RequestBodyModel<RegistrationEmailResending>,
    res: Response<TApiErrorResultObject>,
  ) {
    const resendEmailResult = await this.authService.resendEmail(
      req.body.email,
    );
    if (
      resendEmailResult instanceof WrongEmailError ||
      resendEmailResult instanceof EmailAlreadyConfirmedError
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(responseErrorFunction([resendEmailResult]));
      return;
    }
    if (resendEmailResult instanceof UpdateUserError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(responseErrorFunction([resendEmailResult]));
      return;
    }
    res.status(StatusCodes.NO_CONTENT).send();
  }
  async refreshTokenFunction(
    req: Request,
    res: Response<{ accessToken: string }>,
  ) {
    const oldRefreshToken = req.cookies.refreshToken;
    const userId = req.userId;
    const deviceId = req.currentDeviceId;
    const { accessToken, refreshToken } = await this.authService.refreshSession(
      oldRefreshToken,
      userId,
      deviceId,
    );
    res.cookie("refreshToken", refreshToken, getCookieOptions());
    return res.status(StatusCodes.OK).send({ accessToken });
  }
  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.userId;
    const currentDeviceId = req.currentDeviceId;
    await this.authService.placeRefreshTokenToBlacklist(refreshToken, userId);
    const isSessionDeleted =
      await this.securityDevicesService.deleteSessionById(
        currentDeviceId,
        userId,
      );
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    if (!isSessionDeleted) {
      throw createAppError(
        "Session was deleted or not found",
        StatusCodes.UNAUTHORIZED,
      );
    }
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
