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
const responseErrorUtils_1 = require("../utils/common-utils/responseErrorUtils");
exports.postsRouter = express_1.default.Router({});
//TODO: GET LIST OF POSTS
exports.postsRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(project_db_1.db.posts);
});
//TODO: GET POST BY ID
exports.postsRouter.get("/:id", (req, res) => {
    const foundPost = posts_repository_1.postsRepository.findPostById(req.params.id);
    if (!foundPost) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundPost);
    }
});
//TODO: CREATE A NEW POST
exports.postsRouter.post("/", (req, res) => {
    const errors = [];
    const newPost = posts_repository_1.postsRepository.createNewPost(req.body);
    if (errors.length > 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
    }
    else {
        res.status(http_status_codes_1.StatusCodes.CREATED).send(newPost);
    }
});
//TODO: UPDATE POST BY ID
exports.postsRouter.put("/:id", (req, res) => {
    const errors = [];
    //validation
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
    //401 unauthorized
    res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const isUpdated = posts_repository_1.postsRepository.updatePostById(req.params.id, req.body);
    if (!isUpdated) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//TODO: DELETE POST BY ID
exports.postsRouter.delete("/:id", (req, res) => {
    const isDeleted = posts_repository_1.postsRepository.deletePostById(req.params.id);
    //401 unauthorized
    res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    if (!isDeleted) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//# sourceMappingURL=posts-router.js.map