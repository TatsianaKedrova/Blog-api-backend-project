"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const videos_db_1 = require("../temporal-database/videos-db");
exports.videosRouter = express_1.default.Router({});
exports.videosRouter.get("/", (req, res) => {
    if (videos_db_1.videos.length > 0) {
        res.status(http_status_codes_1.StatusCodes.OK).send(videos_db_1.videos);
    }
});
exports.videosRouter.get("/:id", (req, res) => {
    const foundVideoById = videos_db_1.videos.find((element) => element.id === +req.params.id);
    if (!foundVideoById) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundVideoById);
    }
});
exports.videosRouter.post("/", (req, res) => { });
//# sourceMappingURL=video-router.js.map