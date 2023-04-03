"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const videos_db_1 = require("../temporal-database/videos-db");
exports.testingRouter = express_1.default.Router({});
//TODO REMOVE ALL COURSES
exports.testingRouter.delete("/all-data", (req, res) => {
    videos_db_1.db.videos = [];
    res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
});
//# sourceMappingURL=testing-router.js.map