import { Request } from "express";
import { TUpdateVideoInputModel } from "./data.types";

export type RequestWithBody<I, T> = Request<I, {}, T>;