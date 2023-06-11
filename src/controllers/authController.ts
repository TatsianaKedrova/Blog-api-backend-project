import { getCurrentUserInfo } from "./../utils/auth-utils/getCurrentUserInfo";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import {
  LoginInputModel,
  MeViewModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
} from "../dto/authDTO/authDTO";
import { RequestBodyModel } from "../dto/common/RequestModels";
import { Request, Response } from "express";
import { makeTokenModel } from "../utils/auth-utils/tokenModel";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { UserInputModel } from "../dto/usersDTO/usersDTO";
import { authService } from "../domain/auth-service";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { responseErrorFunction } from "../utils/common-utils/responseErrorFunction";
import { UserAlreadyExistsError } from "../utils/errors-utils/registration-errors/UserAlreadyExistsError";
import { RegistrationError } from "../utils/errors-utils/registration-errors/RegistrationError";
import { IncorrectConfirmationCodeError } from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import { UpdateUserError } from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import { UserIsConfirmedError } from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import { ConfirmationCodeExpiredError } from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import { WrongEmailError } from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import { EmailAlreadyConfirmedError } from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";

export const logIn = async (
  req: RequestBodyModel<LoginInputModel>,
  res: Response
) => {
  const user = await usersService.checkCredentials(
    req.body.loginOrEmail,
    req.body.password
  );
  if (!user) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  const token = await jwtService.createJWT(user);
  const tokenModel = makeTokenModel(token);
  res.status(StatusCodes.OK).send(tokenModel);
};

export const getInfoAboutUser = async (
  req: Request,
  res: Response<MeViewModel>
) => {
  const foundUser = await usersCommandsRepository.findUserById(req.userId!);
  if (foundUser) {
    const currentUser = getCurrentUserInfo(foundUser);
    res.status(StatusCodes.OK).send(currentUser);
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};

export const registerUser = async (
  req: RequestBodyModel<UserInputModel>,
  res: Response<TApiErrorResultObject>
) => {
  const createUserResult = await authService.registerNewUser(req.body);
  if (createUserResult instanceof UserAlreadyExistsError) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(responseErrorFunction([createUserResult]));
    return;
  }
  if (createUserResult instanceof RegistrationError) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(responseErrorFunction([createUserResult]));
    return;
  }
  res.sendStatus(StatusCodes.NO_CONTENT);
};

export const confirmRegistration = async (
  req: RequestBodyModel<RegistrationConfirmationCodeModel>,
  res: Response<TApiErrorResultObject>
) => {
  const confirmCodeResult = await authService.confirmCode(req.body.code);
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
};

export const resendRegistrationEmail = async (
  req: RequestBodyModel<RegistrationEmailResending>,
  res: Response<TApiErrorResultObject>
) => {
  const resendEmailResult = await authService.resendEmail(req.body.email);
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
  res.sendStatus(StatusCodes.NO_CONTENT);
};
