"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_1 = __importDefault(require("express"));
const project_db_1 = require("../temporal-database/project-db");
exports.blogsRouter = express_1.default.Router({});
exports.blogsRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(project_db_1.db.blogs);
});
exports.blogsRouter.get("/:id", (req, res) => {
    const foundBlogById = project_db_1.db.blogs.find((element) => element.id === req.params.id);
    if (!foundBlogById) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundBlogById);
    }
});
//# sourceMappingURL=blogs-router.js.map