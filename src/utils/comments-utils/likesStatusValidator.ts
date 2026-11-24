import { LIKE_STATUSES } from "../../dto/commentsDTO/commentsDTO";
import { stringInputValidatorCommon } from "../common-utils/commonValidator";

export const likesInputValidator = (field: string) => {
  return stringInputValidatorCommon(field)
    .isIn([...LIKE_STATUSES])
    .withMessage(`likeStatus must be one of: ${LIKE_STATUSES.join(", ")}`);
};

export const likesStatusValidator = [likesInputValidator("likeStatus")];
