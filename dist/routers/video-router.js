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
exports.videosRouter = express_1.default.Router({});
//TODO get all videos
exports.videosRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(videos_db_1.videos);
});
//TODO get video by Id
exports.videosRouter.get("/:id", (req, res) => {
    const foundVideoById = videos_db_1.videos.find((element) => element.id === +req.params.id);
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
    const foundVideoById = videos_db_1.videos.findIndex((element) => element.id === +req.params.id);
    if (foundVideoById === -1) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        videos_db_1.videos.splice(foundVideoById, 1);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//TODO create new video
exports.videosRouter.post("/", (req, res) => { });
//TODO update video by id
exports.videosRouter.put("/:id", (req, res) => { });
//# sourceMappingURL=video-router.js.map