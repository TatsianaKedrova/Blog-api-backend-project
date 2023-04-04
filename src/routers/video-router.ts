import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  TApiErrorResult,
  TCreateVideoInputModel,
  TFieldError,
  TUpdateVideoInputModel,
  TVideo,
} from "../dto/data.types";
import { responseErrorFunction } from "../utils/responseErrorUtils";
import { db } from "../temporal-database/videos-db";
import { validatePostBody } from "../utils/videoPostRequestValidator";
import { RequestWithBody } from "../dto/UpdateVideoModel";
import { URIParamsRequest } from "../dto/URIParamsRequest";
import { RequestBodyModel } from "../dto/PostVideoModel";
import crypto from "crypto";
import {
  creationVideoDate,
  publicationVideoDate,
} from "../utils/creation-publication-dates";

export const videosRouter = express.Router({});

//TODO get all videos
videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
  res.status(StatusCodes.OK).send(db.videos);
});

//TODO get video by Id
videosRouter.get(
  "/:id",
  (req: Request<URIParamsRequest>, res: Response<TVideo | TApiErrorResult>) => {
    const getErrors = [];
    const foundVideoById = db.videos.find(
      (element) => element.id === +req.params.id
    );
    if (!foundVideoById) {
      getErrors.push({
        message: "There is no video with such Id",
        field: "Invalid Id",
      });
      res.status(StatusCodes.NOT_FOUND).send(responseErrorFunction(getErrors));
    } else {
      res.status(StatusCodes.OK).send(foundVideoById);
    }
  }
);

//TODO create new video
videosRouter.post(
  "/",
  (
    req: RequestBodyModel<TCreateVideoInputModel>,
    res: Response<TApiErrorResult | TVideo>
  ) => {
    let errors: TFieldError[] = validatePostBody(req.body);
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
    } else {
      const { title, author, availableResolutions } = req.body;
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });

      const newVideo: TVideo = {
        id: +crypto.randomUUID(),
        title,
        author,
        availableResolutions,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: creationVideoDate,
        publicationDate: publicationVideoDate,
      };

      db.videos.push(newVideo);
      res.status(StatusCodes.CREATED).send(newVideo);
    }
  }
);

//TODO delete video by Id
videosRouter.delete(
  "/:id",
  (req: Request<URIParamsRequest>, res: Response<TVideo | TApiErrorResult>) => {
    const foundVideoById = db.videos.findIndex(
      (element) => element.id === +req.params.id
    );
    if (foundVideoById === -1) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      db.videos.splice(foundVideoById, 1);
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);

//TODO update video by id
videosRouter.put(
  "/:id",
  (
    req: RequestWithBody<URIParamsRequest, TUpdateVideoInputModel>,
    res: Response
  ) => {
    const putErrors: TFieldError[] = [];
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;
    // if (!req.body.title.trim()) {
    //   res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json(responseErrorFunction("Title is invalid!", "Title"));
    //   return;
    // }

    const foundVideo = db.videos.find((el) => el.id === req.params.id);
    // if (!foundVideo) {
    //   res
    //     .status(StatusCodes.NOT_FOUND)
    //     .send(responseErrorFunction("Course not found for given id", "id"));
    //   return;
    // }
    if (foundVideo && foundVideo.title) foundVideo.title = req.body.title;
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);

/*fetch("http://localhost:3000/api/videos", {method: "POST", headers: {"Content-Type": "application/json",
        "Accept": "application/json"}, body: JSON.stringify({title: "nadin"})}).then(res => res.json()).then(res => console.log(res))*/
