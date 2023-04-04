import {
  TCreateVideoInputModel,
  TFieldError,
  TResolutions,
  resolutions,
} from "./../dto/data.types";
import { TResolutionsArray } from "../dto/data.types";

const isResolution = (x: TResolutions): x is TResolutions =>
  resolutions.includes(x);

export const validatePostBody = (body: TCreateVideoInputModel) => {
  const { title, author, availableResolutions } = body;
  const errors: TFieldError[] = [];
  if (!title || !title.trim()) {
    errors.push({ message: "Title is invalid", field: "title" });
  } else if (typeof title !== "string") {
    errors.push({ message: "Title must be of type 'string'", field: "title" });
  } else if (title.length > 40) {
    errors.push({
      message: "Title's maximum length must be 40",
      field: "title",
    });
  }
  console.log("errors: ", errors);
  return errors;
};

export const videoInputValidation = {
  validateTitleAndAuthor(requestProperty: string, maxLength: number) {
    if (
      !requestProperty ||
      typeof requestProperty !== "string" ||
      !requestProperty.trim()
    ) {
      return false;
    } else if (requestProperty.trim().length > maxLength) {
      return false;
    } else return true;
  },
  validateResolution(resolutions: TResolutionsArray) {
    if (resolutions.length === 0) {
      return false;
    } else {
      let result;
      const errorResolution = resolutions.find((element) => {
        result = isResolution(element);
        return result;
      });
      return errorResolution;
    }
  },
  validateMinAgeRestriction(minAgeRestriction: number) {
    if (minAgeRestriction < 1 || minAgeRestriction > 18) {
      return false;
    } else return true;
  },
  validateCanBeDownloaded(canBeDownloaded: boolean) {
    if (typeof canBeDownloaded !== "boolean") {
      return false;
    } else return true;
  },
};
