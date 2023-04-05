import {
  TApiErrorResultObject,
  TFieldError,
} from "../dto/videosDTO/ErrorVideoResponseModel";

export const responseErrorFunction = (
  errors: TFieldError[]
): TApiErrorResultObject => {
  return {
    errorsMessages: errors,
  };
};
