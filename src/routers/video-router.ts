import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TVideo } from "../dto/data.types";
import { videos } from "../temporal-database/videos-db";

export const videosRouter = express.Router({});

videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
  if (videos.length > 0) {
    res.status(StatusCodes.OK).send(videos);
  }
});

videosRouter.get(
  "/:id",
  (req: Request<{ id: number }>, res: Response<TVideo>) => {
    const foundVideoById = videos.find(
      (element) => element.id === +req.params.id
    );
    if (!foundVideoById) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).send(foundVideoById);
    }
  }
);

videosRouter.post("/", (req: Request, res: Response) => {});
