"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const responseErrorUtils_1 = require("../utils/common-utils/responseErrorUtils");
const project_db_1 = require("../temporal-database/project-db");
const videoPostRequestValidator_1 = require("../utils/videoUtils/videoPostRequestValidator");
const creation_publication_dates_1 = require("../utils/common-utils/creation-publication-dates");
const videoPutRequestValidator_1 = require("../utils/videoUtils/videoPutRequestValidator");
exports.videosRouter = express_1.default.Router({});
//TODO get all videos
exports.videosRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(project_db_1.db.videos);
});
//TODO get video by Id
exports.videosRouter.get("/:id", (req, res) => {
    const errors = [];
    const foundVideoById = project_db_1.db.videos.find((element) => element.id === +req.params.id);
    if (!foundVideoById) {
        errors.push({
            message: "There is no video with such Id",
            field: "Invalid Id",
        });
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundVideoById);
    }
});
//TODO create new video
exports.videosRouter.post("/", (req, res) => {
    let errors = (0, videoPostRequestValidator_1.validatePostBody)(req.body);
    if (errors.length > 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
        return;
    }
    else {
        const { title, author, availableResolutions } = req.body;
        res.set({
            "Content-Type": "application/json",
            Accept: "application/json",
        });
        const newVideo = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            title,
            author,
            availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: creation_publication_dates_1.creationVideoDate,
            publicationDate: creation_publication_dates_1.publicationVideoDate,
        };
        project_db_1.db.videos.push(newVideo);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(newVideo);
    }
});
//TODO delete video by Id
exports.videosRouter.delete("/:id", (req, res) => {
    const foundVideoById = project_db_1.db.videos.findIndex((element) => element.id === +req.params.id);
    if (foundVideoById === -1) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        project_db_1.db.videos.splice(foundVideoById, 1);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//TODO update video by id
exports.videosRouter.put("/:id", (req, res) => {
    const errors = (0, videoPutRequestValidator_1.videoPutRequestValidator)(req.body);
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = req.body;
    if (errors.length > 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
        return;
    }
    const foundVideo = project_db_1.db.videos.find((el) => el.id === +req.params.id);
    if (!foundVideo) {
        errors.push({ message: "Not_Found video with such ID", field: "id" });
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
        return;
    }
    else {
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
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//# sourceMappingURL=video-router.js.map