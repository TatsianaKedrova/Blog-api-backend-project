import { Request } from "express";

export type RequestBodyModel<B> = Request<{}, {}, B>;
export type RequestWithURIParam<I> = Request<I, {}, {}>;
export type RequestWithURIParamsAndBody<I, T> = Request<I, {}, T>;
