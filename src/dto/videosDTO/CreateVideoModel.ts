import { Request } from "express";
import { TResolutionsArray } from "./ResolutionsVideoModel";
import { TUpdateVideoInputModel } from "./UpdateVideoModel";

export type RequestBodyModel<B> = Request<{}, {}, B>;

export type TCreateVideoInputModel = {
  title: string; // required, maxLength = 40
  author: string; //required, maxLength = 20
  availableResolutions: TResolutionsArray;
};

export type TVideo = TUpdateVideoInputModel & {
  id: number;
  createdAt: string;
};
