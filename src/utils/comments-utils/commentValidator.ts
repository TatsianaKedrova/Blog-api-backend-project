import { stringsInputValidatorWithLength } from "../validators/commonValidator";

export const commentValidator = [
  stringsInputValidatorWithLength("content", 300, 20),
];
