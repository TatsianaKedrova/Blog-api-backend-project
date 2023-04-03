"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./routers/video-router");
const testing_router_1 = require("./routers/testing-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api/videos", video_router_1.videosRouter);
exports.app.use("/api/testing", testing_router_1.testingRouter);
//# sourceMappingURL=settings.js.map