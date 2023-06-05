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

export const logIn = async (
  req: RequestBodyModel<LoginInputModel>,
  res: Response
) => {
  const user = await usersService.checkCredentials(
    req.body.loginOrEmail,
    req.body.password
  );
  if (user) {
    const token = await jwtService.createJWT(user);
    const tokenModel = makeTokenModel(token);
    res.status(StatusCodes.OK).send(tokenModel);
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
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
  const isUserAlreadyExists = await usersService.checkCredentials(
    req.body.email,
    req.body.password
  );
  if (isUserAlreadyExists) {
    res.status(StatusCodes.BAD_REQUEST).send({
      errorsMessages: [
        {
          message: "User with the given email or password already exists",
          field: "registration",
        },
      ],
    });
  } else {
    await authService.registerNewUser(req.body);
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

export const confirmRegistration = async (
  req: RequestBodyModel<RegistrationConfirmationCodeModel>,
  res: Response<TApiErrorResultObject>
) => {
  res.sendStatus(StatusCodes.NO_CONTENT);
};

export const resendRegistrationEmail = async (
  req: RequestBodyModel<RegistrationEmailResending>,
  res: Response<TApiErrorResultObject>
) => {};
