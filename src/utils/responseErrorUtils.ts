import { TApiErrorResult, TFieldError } from "../dto/data.types";

export const responseErrorFunction = (
  errors: TFieldError[]
): TApiErrorResult => {
  return {
    errorsMessages: errors,
  };
};