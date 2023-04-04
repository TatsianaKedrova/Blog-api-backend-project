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
exports.videosRouter = express_1.default.Router({});
//TODO get all videos
exports.videosRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(videos_db_1.db.videos);
});
//TODO get video by Id
exports.videosRouter.get("/:id", (req, res) => {
    const foundVideoById = videos_db_1.db.videos.find((element) => element.id === +req.params.id);
    if (!foundVideoById) {
        res
            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
            .send((0, responseErrorUtils_1.responseErrorFunction)("There is no video with such Id", "Invalid Id"));
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundVideoById);
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
//TODO create new video
exports.videosRouter.post("/", (req, res) => {
    res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
    });
    const { title, author, availableResolutions } = req.body;
    const titleValidation = inputRequestValidator_1.videoInputValidation.validateTitleAndAuthor(title, 40);
    const authorValidation = inputRequestValidator_1.videoInputValidation.validateTitleAndAuthor(author, 20);
    const resolutionValidation = inputRequestValidator_1.videoInputValidation.validateResolution(availableResolutions);
    if (!titleValidation) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)("Title is invalid", "title"));
    }
    else if (!authorValidation) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)("Author is invalid", "Author"));
    }
    else if (!resolutionValidation) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)("Resolution is invalid", "Resolution"));
    }
    else {
        const newVideo = {
            id: +Math.random(),
            title: req.body.title,
            author: req.body.author,
            availableResolutions: req.body.availableResolutions,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
        };
        videos_db_1.db.videos.push(newVideo);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(newVideo);
    }
});
//TODO update video by id
exports.videosRouter.put("/:id", (req, res) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (!req.body.title.trim()) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)("Title is invalid!", "Title"));
        return;
    }
    const foundVideo = videos_db_1.db.videos.find((el) => el.id === req.params.id);
    if (!foundVideo) {
        res
            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
            .send((0, responseErrorUtils_1.responseErrorFunction)("Course not found for given id", "id"));
        return;
    }
    // foundVideo.title = req.body.title;
    res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
});
//# sourceMappingURL=video-router.js.map