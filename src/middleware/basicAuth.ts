import { Request, Response } from "express";
import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export let basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authValue = req.get("Authorization");

  //If Authorization header not present
  if (!authValue) {
    const error = new Error("Not Authenticated!");
    res.status(StatusCodes.UNAUTHORIZED)/*.set("WWW-Authenticate", "Basic")*/;
    next(error);
  }
  //If Authorization header present
  else {
    let credentials = Buffer.from(authValue.split(" ")[1], "base64")
      .toString()
      .split(":");
    let username = credentials[0];
    let password = credentials[1];
    if (!(username === "admin" && password === "qwerty")) {
      const error = new Error("Not Authenticated!");
      res.status(StatusCodes.UNAUTHORIZED).set("WWW-Authenticate", "Basic");
      next(error);
    }
    res.status(StatusCodes.OK);
    next();
  }
};
