"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const responseErrorUtils_1 = require("../utils/responseErrorUtils");
const videos_db_1 = require("../temporal-database/videos-db");
const inputRequestValidator_1 = require("../utils/inputRequestValidator");
const uuid_1 = require("uuid");
const creation_publication_dates_1 = require("../utils/creation-publication-dates");
exports.videosRouter = express_1.default.Router({});
//TODO get all videos
exports.videosRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(videos_db_1.db.videos);
});
//TODO get video by Id
exports.videosRouter.get("/:id", (req, res) => {
    const getErrors = [];
    const foundVideoById = videos_db_1.db.videos.find((element) => element.id === +req.params.id);
    if (!foundVideoById) {
        getErrors.push({
            message: "There is no video with such Id",
            field: "Invalid Id",
        });
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send((0, responseErrorUtils_1.responseErrorFunction)(getErrors));
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundVideoById);
    }
});
//TODO create new video
exports.videosRouter.post("/", (req, res) => {
    let errors = (0, inputRequestValidator_1.validatePostBody)(req.body);
    if (errors.length > 0) {
    }
    else {
        const { title, author, availableResolutions } = req.body;
        res.set({
            "Content-Type": "application/json",
            Accept: "application/json",
        });
        const newVideo = {
            id: +(0, uuid_1.v4)(),
            title,
            author,
            availableResolutions,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: creation_publication_dates_1.creationVideoDate,
            publicationDate: creation_publication_dates_1.publicationVideoDate,
        };
        videos_db_1.db.videos.push(newVideo);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(newVideo);
    }
});
//TODO delete video by Id
exports.videosRouter.delete("/:id", (req, res) => {
    const foundVideoById = videos_db_1.db.videos.findIndex((element) => element.id === +req.params.id);
    if (foundVideoById === -1) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        videos_db_1.db.videos.splice(foundVideoById, 1);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//TODO update video by id
exports.videosRouter.put("/:id", (req, res) => {
    const putErrors = [];
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = req.body;
    // if (!req.body.title.trim()) {
    //   res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json(responseErrorFunction("Title is invalid!", "Title"));
    //   return;
    // }
    const foundVideo = videos_db_1.db.videos.find((el) => el.id === req.params.id);
    // if (!foundVideo) {
    //   res
    //     .status(StatusCodes.NOT_FOUND)
    //     .send(responseErrorFunction("Course not found for given id", "id"));
    //   return;
    // }
    if (foundVideo && foundVideo.title)
        foundVideo.title = req.body.title;
    res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
});
// const titleValidation = videoInputValidation.validateTitleAndAuthor(
//   title,
//   40
// );
// const authorValidation = videoInputValidation.validateTitleAndAuthor(
//   author,
//   20
// );
// const resolutionValidation =
//   videoInputValidation.validateResolution(availableResolutions);
// if (!titleValidation) {
//   res
//     .status(StatusCodes.BAD_REQUEST)
//     .json(responseErrorFunction("Title is invalid", "title"));
// } else if (!authorValidation) {
//   res
//     .status(StatusCodes.BAD_REQUEST)
//     .json(responseErrorFunction("Author is invalid", "Author"));
// } else if (!resolutionValidation) {
//   res
//     .status(StatusCodes.BAD_REQUEST)
//     .json(responseErrorFunction("Resolution is invalid", "Resolution"));
// }
//# sourceMappingURL=video-router.js.map