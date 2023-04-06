import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { responseErrorFunction } from "../utils/responseErrorUtils";
import { db } from "../temporal-database/videos-db";
import { validatePostBody } from "../utils/videoPostRequestValidator";
import {
  RequestWithURIParamsAndBody,
  TUpdateVideoInputModel,
} from "../dto/videosDTO/UpdateVideoModel";
import { URIParamsRequest } from "../dto/videosDTO/URIParamsRequest";
import {
  RequestBodyModel,
  TCreateVideoInputModel,
  TVideo,
} from "../dto/videosDTO/CreateVideoModel";
import {
  creationVideoDate,
  publicationVideoDate,
} from "../utils/creation-publication-dates";
import {
  TApiErrorResultObject,
  TFieldError,
} from "../dto/videosDTO/ErrorVideoResponseModel";
import { videoPutRequestValidator } from "../utils/videoPutRequestValidator";

export const videosRouter = express.Router({});

//TODO get all videos
videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
  res.status(StatusCodes.OK).send(db.videos);
});

//TODO get video by Id
videosRouter.get(
  "/:id",
  (
    req: Request<URIParamsRequest>,
    res: Response<TVideo | TApiErrorResultObject>
  ) => {
    const errors = [];
    const foundVideoById = db.videos.find(
      (element) => element.id === +req.params.id
    );
    if (!foundVideoById) {
      errors.push({
        message: "There is no video with such Id",
        field: "Invalid Id",
      });
      res.status(StatusCodes.NOT_FOUND).send(responseErrorFunction(errors));
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
    res: Response<TApiErrorResultObject | TVideo>
  ) => {
    let errors: TFieldError[] = validatePostBody(req.body);
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
      return;
    } else {
      const { title, author, availableResolutions } = req.body;
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });

      const newVideo: TVideo = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        title,
        author,
        availableResolutions,
        canBeDownloaded: false,
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
  (
    req: Request<URIParamsRequest>,
    res: Response<TVideo | TApiErrorResultObject>
  ) => {
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
    req: RequestWithURIParamsAndBody<URIParamsRequest, TUpdateVideoInputModel>,
    res: Response
  ) => {
    const errors: TFieldError[] = videoPutRequestValidator(req.body);
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
      return;
    }
    const foundVideo = db.videos.find((el) => el.id === +req.params.id);
    if (!foundVideo) {
      errors.push({ message: "Not_Found video with such ID", field: "id" });
      res.status(StatusCodes.NOT_FOUND).send(responseErrorFunction(errors));
      return;
    } else {
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      foundVideo.publicationDate = publicationDate;
      foundVideo.canBeDownloaded = canBeDownloaded;
      foundVideo.author = author;
      foundVideo.title = title;
      foundVideo.minAgeRestriction = minAgeRestriction;
      foundVideo.availableResolutions = availableResolutions;
      res.status(StatusCodes.OK).send(foundVideo);
    }
  }
);

/*fetch("https://blog-api-backend-project-git-master-tatsianakedrova.vercel.app/api/videos", {method: "POST", headers: {"Content-Type": "application/json",
        "Accept": "application/json"}, body: JSON.stringify({title: "nadin", author: "jack london", availableResolutions: ["P144"]})}).then(res => res.json()).then(res => console.log(res))*/
