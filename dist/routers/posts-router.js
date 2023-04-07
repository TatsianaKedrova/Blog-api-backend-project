"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const project_db_1 = require("../temporal-database/project-db");
const posts_repository_1 = require("../repositories/posts-repository");
exports.postsRouter = express_1.default.Router({});
exports.postsRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(project_db_1.db.posts);
});
exports.postsRouter.get("/:id", (req, res) => {
    const foundPost = posts_repository_1.postsRepository.findPostById(req.params.id);
    if (!foundPost) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundPost);
    }
});
exports.postsRouter.post("/", (req, res) => {
    const errors = [];
    const newPost = posts_repository_1.postsRepository.createNewPost(req.body);
    //   if(newPost) {
    //     res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors))
    //   }
    //   res.status(StatusCodes.CREATED).send(newPost);
});
//# sourceMappingURL=posts-router.js.map