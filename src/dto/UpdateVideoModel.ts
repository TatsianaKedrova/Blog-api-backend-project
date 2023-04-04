import { Request } from "express";

export type RequestWithBody<I, T> = Request<I, {}, T>;