import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { AppErrorObject } from "../dto/appDTO/commonDTO";

export const createAppError = (
  message: string,
  statusCode: StatusCodes,
): AppErrorObject => {
  const error = new Error(message) as AppErrorObject;

  error.statusCode = statusCode;
  try {
    error.status = getReasonPhrase(statusCode); // e.g., 401 -> "Unauthorized"
  } catch {
    error.status = "Internal Server Error";
  }
  error.isOperational = true;

  // Maintains a clean stack trace in V8 engines (Node.js)
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createAppError);
  }

  return error;
};
