export type TApiErrorResultObject = {
  errorsMessages: TFieldError[];
};
export type TFieldError = {
  message: string;
  field: string;
};
export type ApiErrorResult = TFieldError[];
