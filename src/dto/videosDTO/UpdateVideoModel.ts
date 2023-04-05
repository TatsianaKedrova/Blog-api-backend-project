import { Request } from "express";
import { TCreateVideoInputModel } from "./CreateVideoModel";

export type RequestWithBody<I, T> = Request<I, {}, T>;

export type TUpdateVideoInputModel = TCreateVideoInputModel & {
    canBeDownloaded: boolean; //by default = false
    minAgeRestriction: number | null; //max=18, min=1
    publicationDate: string;
  };