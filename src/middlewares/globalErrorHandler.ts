import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
  err: any, // We use 'any' here because Express can throw any type of native/library error
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let status = err.status || "error";
  let message = err.message || "Something went wrong on the server";

  if (err.isOperational) {
    // This is a handled client-side error (400, 401, 403, 404, etc.)
    // The message is completely safe to show to the end user.
    console.log(`ℹ️ Operational Error (${statusCode}): ${message}`);
  } else {
    // This is an unhandled system error (500 - e.g., Database dropped, Null reference crash)
    // Log the full stack trace for you (the developer) to debug in your terminal
    console.error("💥 CRITICAL UNHANDLED SYSTEM ERROR:", err);

    // Security Best Practice: Don't leak raw database/system errors to hackers
    message = "An unexpected system error occurred";
  }
  // 3. Send the standardized JSON response back to the client
  res.status(statusCode).json({
    status: status,
    message: message,
  });
};
