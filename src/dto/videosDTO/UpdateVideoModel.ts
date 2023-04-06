import { Request } from "express";
import { TCreateVideoInputModel } from "./CreateVideoModel";

export type RequestWithURIParamsAndBody<I, T> = Request<I, {}, T>;

export type TUpdatePartialFields = {
  canBeDownloaded: boolean; //by default = false
  minAgeRestriction: number | null; //max=18, min=1
  publicationDate: string;
};

export type TUpdateVideoInputModel = TCreateVideoInputModel &
  Partial<TUpdatePartialFields>;
