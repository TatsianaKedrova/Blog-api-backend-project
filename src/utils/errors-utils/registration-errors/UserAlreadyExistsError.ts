import { CommonErrorResponse } from "../CommonErrorResponse";

export class UserAlreadyExistsError extends CommonErrorResponse {
  message: string;
  field: string;
  constructor() {
    super();
    this.message = "User with the given email or login already exists";
    this.field = "registration";
  }

  getResult() {
    return super.getErrorObject(this.message, this.field);
  }
}
