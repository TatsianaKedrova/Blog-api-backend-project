import { TResolutions } from "./../dto/data.types";
import { StatusCodes } from "http-status-codes";
import { responseErrorFunction } from "./responseErrorUtils";
import { Response } from "express";
import { TResolutionsArray } from "../dto/data.types";

export const validateRequestBody = (
  requestProperty: string,
  maxLength: number,
  errorMessage: string,
  res: Response
) => {
  if (!requestProperty.trim()) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        responseErrorFunction(`${errorMessage} is invalid`, `${errorMessage}`)
      );
    return;
  } else if (requestProperty.trim().length > maxLength) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        responseErrorFunction(
          `Max length of ${errorMessage} should be ${maxLength}`,
          `${errorMessage}`
        )
      );
    return;
  }
};

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

export const validateResolutions = (
  resolutions: TResolutionsArray,
  res: Response
) => {
  if (resolutions.length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        responseErrorFunction(
          "There should be at least one resolution for created video",
          "Resolution"
        )
      );
    return;
  }
  resolutions.map((element) => {
    const result = isResolution(element);
    if (!result) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          responseErrorFunction(
            `Resolution ${element} doesn't exist`,
            "Resolution"
          )
        );
    }
  });
};
