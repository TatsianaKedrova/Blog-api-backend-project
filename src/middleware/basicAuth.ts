import { Request, Response } from "express";
import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
let authValue;
export let basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") {
    return next();
  }
  authValue = req.get("Authorization");
  if (!authValue) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .set("WWW-Authenticate", "Basic")
      .send();
  } else {
    let credentials = Buffer.from(authValue.split(" ")[1], "base64")
      .toString()
      .split(":");
    let username = credentials[0];
    let password = credentials[1];
    if (!(username === "admin" && password === "qwerty")) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .set("WWW-Authenticate", "Basic")
        .send();
    }
    next();
  }
};
