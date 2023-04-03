import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TApiErrorResult, TRequestBodyModel, TVideo } from "../dto/data.types";
import { responseErrorFunction } from "../utils/responseErrorUtils";
import { videos } from "../temporal-database/videos-db";
import {
  createVideoInputValidation,
} from "../utils/inputRequestValidator";

export const videosRouter = express.Router({});

//TODO get all videos
videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
  res.status(StatusCodes.OK).send(videos);
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
videosRouter.post(
  "/",
  (req: TRequestBodyModel, res: Response<TApiErrorResult | TVideo>) => {
    res.set({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    const { title, author, availableResolutions } = req.body;
    const titleValidation = createVideoInputValidation.validateTitleAndAuthor(
      title,
      40
    );
    const authorValidation = createVideoInputValidation.validateTitleAndAuthor(
      author,
      20
    );
    const resolutionValidation =
      createVideoInputValidation.validateResolution(availableResolutions);
    if (!titleValidation) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(responseErrorFunction("Title is invalid", "title"));
    } else if (!authorValidation) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(responseErrorFunction("Author is invalid", "Author"));
    } else if (!resolutionValidation) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(responseErrorFunction("Resolution is invalid", "Resolution"));
    } else {
      const newVideo: TVideo = {
        id: 0,
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
      };

      videos.push(newVideo);
      res.status(StatusCodes.CREATED).send(newVideo);
    }
  }
);

//TODO update video by id
videosRouter.put("/:id", (req: Request, res: Response) => {});
