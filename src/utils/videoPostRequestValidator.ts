import { TCreateVideoInputModel, TFieldError } from "../dto/data.types";
import { videoResolutionValidator } from "./videoResolutionValidator";
import { videoTitleAuthorValidation } from "./videoTitleAuthorValidator";

export const validatePostBody = (
  body: TCreateVideoInputModel
): TFieldError[] => {
  const { title, author, availableResolutions } = body;
  const errors: TFieldError[] = [];

  const titleErrors = videoTitleAuthorValidation(title, 40, "Title");
  const authorErrors = videoTitleAuthorValidation(author, 20, "Author");
  const resolutionsErrors = videoResolutionValidator(availableResolutions);

  return [...errors, ...titleErrors, ...authorErrors, ...resolutionsErrors];
};
