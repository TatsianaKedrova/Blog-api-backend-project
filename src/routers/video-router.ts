import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TApiErrorResult, TVideo } from "../dto/data.types";
import { videos } from "../temporal-database/videos-db";
import { responseErrorFunction } from "../utils/responseErrorUtils";

export const videosRouter = express.Router({});

//TODO get all videos
videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
  if (videos.length > 0) {
    res.status(StatusCodes.OK).send(videos);
  }
});

//TODO get video by Id
videosRouter.get(
  "/:id",
  (req: Request<{ id: number }>, res: Response<TVideo | TApiErrorResult>) => {
    const foundVideoById = videos.find(
      (element) => element.id === +req.params.id
    );
    if (!foundVideoById) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send(
          responseErrorFunction("There is no video with such Id", "Invalid Id")
        );
    } else {
      res.status(StatusCodes.OK).send(foundVideoById);
    }
  }
);

//TODO delete video by Id
videosRouter.delete(
  "/:id",
  (req: Request<{ id: number }>, res: Response<TVideo | TApiErrorResult>) => {
    const foundVideoById = videos.findIndex(
      (element) => element.id === +req.params.id
    );
    if (foundVideoById === -1) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      videos.splice(foundVideoById, 1);
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);


//TODO create new video
videosRouter.post("/", (req: Request, res: Response) => {});

//TODO update video by id
videosRouter.put("/:id", (req: Request, res: Response) => {});


