import express, { Request, Response } from "express";
import { usersService } from "../domain/users-service";
import { RequestBodyModel } from "../dto/common/RequestModels";
import { LoginInputModel } from "../dto/authDTO/authDTO";
import { StatusCodes } from "http-status-codes";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/auth-validator";
import { jwtService } from "../application/jwt-service";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authValidator,
  responseErrorValidationMiddleware,
  async (req: RequestBodyModel<LoginInputModel>, res: Response) => {
    const user = await usersService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (user) {
      const token = await jwtService.createJWT(user);
      res.status(StatusCodes.CREATED).send(token);
    } else {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  }
);

authRouter.get("/me", async (req: Request, res: Response) => {});
