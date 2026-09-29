import { StatusCodes } from "http-status-codes";

export interface AppErrorObject extends Error {
  statusCode: StatusCodes;
  status: string;
  isOperational: boolean;
}
