import { RegistrationConfirmationError } from "./RegistrationConfirmationError";

export class IncorrectConfirmationCodeError extends RegistrationConfirmationError {
  message: string;
  field: string;
  constructor() {
    super();
    this.message = "Confirmation code is incorrect";
    this.field = super.getField;
  }

  getResult() {
    return super.getErrorObject(this.message, this.field);
  }
}
