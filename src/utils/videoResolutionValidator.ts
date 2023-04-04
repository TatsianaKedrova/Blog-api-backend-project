import {
  TFieldError,
  TResolutionsArray,
  resolutions,
  TResolutions,
} from "../dto/data.types";

const isResolution = (x: TResolutions): x is TResolutions =>
  resolutions.includes(x);

export const videoResolutionValidator = (
  availableResolutions: TResolutionsArray
): TFieldError[] => {
  const errors: TFieldError[] = [];
  if (availableResolutions === undefined) {
    errors.push({
      message: "Please include at least 1 resolution",
      field: "available resolutions",
    });
  } else if (availableResolutions.length === 0) {
    errors.push({
      message: "Please include at least 1 resolution",
      field: "available resolutions",
    });
  } else {
    let result;
    availableResolutions
      .filter((element) => {
        result = isResolution(element);
        return result === false;
      })
      .map((wrongResolution) =>
        errors.push({
          message: `Resolution ${wrongResolution} is invalid`,
          field: "video resolutions",
        })
      );
  }
  return errors;
};
