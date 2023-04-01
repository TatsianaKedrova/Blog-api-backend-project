"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
exports.videosRouter = express_1.default.Router({});
exports.videosRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send();
});
//# sourceMappingURL=video-router.js.map