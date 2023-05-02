import express, { Response } from "express";
import { usersService } from "../domain/users-service";
import { RequestBodyModel } from "../dto/common/RequestModels";
import { LoginInputModel } from "../dto/authDTO/authDTO";
import { StatusCodes } from "http-status-codes";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  async (req: RequestBodyModel<LoginInputModel>, res: Response) => {
    const checkResult = await usersService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (checkResult) {
      res.sendStatus(StatusCodes.NO_CONTENT);
    } else {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  }
);
