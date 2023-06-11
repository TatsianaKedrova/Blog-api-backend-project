import { CommonErrorResponse } from "../CommonErrorResponse";

export class ResendEmailError extends CommonErrorResponse {
  field: string;
  constructor() {
    super();
    this.field = "registration-email-resending";
  }
  get getField() {
    return this.field;
  }
}
