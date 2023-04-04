export type TApiErrorResult = {
  errorsMessages: TFieldError[];
};
export type TFieldError = {
  message: string;
  field: string;
};
export type ApiErrorResult = TFieldError[];

export const resolutions: TResolutionsArray = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
];
export type TResolutions =
  | "P144"
  | "P240"
  | "P360"
  | "P480"
  | "P720"
  | "P1080"
  | "P1440"
  | "P2160";
type NonEmptyArray<T> = [T, ...T[]];

export type TResolutionsArray = NonEmptyArray<TResolutions>;

export type TCreateVideoInputModel = {
  title: string; // required, maxLength = 40
  author: string; //required, maxLength = 20
  availableResolutions: TResolutionsArray;
};

export type TUpdateVideoInputModel = TCreateVideoInputModel & {
  canBeDownloaded: boolean; //by default = false
  minAgeRestriction: number | null; //max=18, min=1
  publicationDate: string;
};

export type TVideo = TUpdateVideoInputModel & {
  id: number;
  createdAt: string;
};

export type TDataBase = {
  [key: string]: TVideo[];
};