import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { LoginInputModel } from "../dto/authDTO/authDTO";
import { RequestBodyModel } from "../dto/common/RequestModels";
import { Request, Response } from "express";
import { makeTokenModel } from "../utils/auth-utils/tokenModel";

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

export const getInfoAboutUser = async (req: Request, res: Response) => {
  
};