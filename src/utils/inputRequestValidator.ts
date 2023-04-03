import { TResolutions } from "./../dto/data.types";
import { TResolutionsArray } from "../dto/data.types";

const resolutions: TResolutionsArray = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
];
const isResolution = (x: TResolutions): x is TResolutions =>
  resolutions.includes(x);

export const videoInputValidation = {
  validateTitleAndAuthor(requestProperty: string, maxLength: number) {
    if (!requestProperty || typeof requestProperty !== "string" || !requestProperty.trim()) {
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
  }
};
