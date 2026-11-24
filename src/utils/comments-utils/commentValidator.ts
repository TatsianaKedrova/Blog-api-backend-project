import { stringsInputValidatorWithLength } from "../common-utils/commonValidator";

export const commentValidator = [
  stringsInputValidatorWithLength("content", 300, 20),
];
