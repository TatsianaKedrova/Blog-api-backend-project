import { userEmailRegex, userLoginRegex } from "../common-utils/regexes";
import {
  stringInputValidatorCommon,
  stringsInputValidatorWithLength,
} from "./commonValidator";

export const loginValidator = [
  stringInputValidatorCommon("loginOrEmail"),
  stringInputValidatorCommon("password"),
];

export const passwordResetValidator = [
  stringInputValidatorCommon("recoveryCode"),
  stringsInputValidatorWithLength("newPassword", 20, 6),
];
export const userRegistrationValidator = [
  stringsInputValidatorWithLength("login", 10, 3)
    .matches(userLoginRegex)
    .withMessage(
      `Login doesn't match this regular expression: ${userLoginRegex}`,
    ),
  stringsInputValidatorWithLength("password", 20, 6),
  stringInputValidatorCommon("email")
    .matches(userEmailRegex)
    .withMessage(
      `Email doesn't match this regular expression: ${userEmailRegex}`,
    ),
];

export const confirmationCodeValidator = [stringInputValidatorCommon("code")];

export const emailValidator = [
  stringInputValidatorCommon("email")
    .matches(userEmailRegex)
    .withMessage(
      `Email doesn't match this regular expression: ${userEmailRegex}`,
    ),
];


