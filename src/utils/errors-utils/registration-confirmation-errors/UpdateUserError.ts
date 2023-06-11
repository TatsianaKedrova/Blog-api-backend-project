import { RegistrationConfirmationError } from "./RegistrationConfirmationError";

export class UpdateUserError extends RegistrationConfirmationError {
    message: string;
    field: string;
    constructor() {
      super();
      this.message = "Something went wrong with update operation";
      this.field = super.getField;
    }
  
    getResult() {
      return super.getErrorObject(this.message, this.field);
    }
  }