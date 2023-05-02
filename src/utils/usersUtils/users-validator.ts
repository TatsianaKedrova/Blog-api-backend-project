import {
  stringInputValidatorCommon,
  stringsInputValidatorWithLength,
} from "./../common-utils/validatorForStrings";
const emailRegex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
const loginRegex = new RegExp("^[a-zA-Z0-9_-]*$");
export const createUserValidator = [
  stringsInputValidatorWithLength("login", 10, 3)
    .matches(loginRegex)
    .withMessage(`Login doesn't match this regular expression: ${loginRegex}`),
  stringsInputValidatorWithLength("password", 20, 6),
  stringInputValidatorCommon("email")
    .matches(emailRegex)
    .withMessage(`Email doesn't match this regular expression: ${emailRegex}`),
];
