import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TVideo } from "../dto/data.types";

export const videosRouter = express.Router({});

videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
    res.status(StatusCodes.OK).send()
})
