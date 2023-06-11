import { CommonErrorResponse } from "../CommonErrorResponse";

export class RegistrationConfirmationError extends CommonErrorResponse {
  field: string;
  constructor() {
    super();
    this.field = "registration-confirmation";
  }
  get getField() {
    return this.field;
  }
}
