"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./routers/video-router");
const testing_router_1 = require("./routers/testing-router");
const blogs_router_1 = require("./routers/blogs-router");
const posts_router_1 = require("./routers/posts-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api/videos", video_router_1.videosRouter);
exports.app.use("/api/testing", testing_router_1.testingRouter);
exports.app.use("/api/blogs", blogs_router_1.blogsRouter);
exports.app.use("/api/posts", posts_router_1.postsRouter);
//# sourceMappingURL=settings.js.map