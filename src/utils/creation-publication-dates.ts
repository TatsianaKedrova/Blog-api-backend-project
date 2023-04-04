import { TFieldError } from "../dto/data.types";

export const creationVideoDate = new Date().toISOString();
export const publicationVideoDate = new Date(
  new Date().setDate(new Date().getDate() + 1)
).toISOString();

export const dateISOPattern =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

export const dateValidator = (publicationDate: string): TFieldError[] => {
  const errors: TFieldError[] = [];
  if (publicationDate === null || publicationDate === undefined) {
    errors.push({
      message: "Publication date should be a valid date ISOString format",
      field: "Publication date",
    });
  } else if (typeof publicationDate !== "string") {
    errors.push({
      message: "Publication date should be of type String",
      field: "Publication date",
    });
  } else if (!dateISOPattern.test(creationVideoDate)) {
    errors.push({
      message: "Publication date should match this format: '/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/'",
      field: "Publication date",
    });
  }

  return errors;
};
