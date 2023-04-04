import { Request } from "express";

export type RequestBodyModel<B> = Request<{}, {}, B>;
