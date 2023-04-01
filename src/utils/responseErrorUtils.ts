import { TApiErrorResult } from "../dto/data.types";

export const responseErrorFunction = (
  message: string,
  field: string
): TApiErrorResult => {
  return {
    errorsMessages: [{ message, field }],
  };
};