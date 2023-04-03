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

export const createVideoInputValidation = {
  validateTitleAndAuthor(
    requestProperty: string,
    maxLength: number
  ) {
    if (!requestProperty || !requestProperty.trim()) {
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
};
