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
const basicAuth_1 = require("../middlewares/basicAuth");
exports.postsRouter = express_1.default.Router({});
const postsValidator_1 = require("../utils/postsValidator/postsValidator");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.postsRouter.use(basicAuth_1.basicAuthMiddleware);
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
exports.postsRouter.post("/", (0, postsValidator_1.stringsInputValidator)("title", 30), (0, postsValidator_1.stringsInputValidator)("shortDescription", 100), (0, postsValidator_1.stringsInputValidator)("content", 1000), (0, express_validator_1.body)("blogId").custom(postsValidator_1.isValidBlogId), input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
    });
    const newPost = posts_repository_1.postsRepository.createNewPost(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).send(newPost);
});
//TODO: UPDATE POST BY ID
exports.postsRouter.put("/:id", (0, postsValidator_1.stringsInputValidator)("title", 30), (0, postsValidator_1.stringsInputValidator)("shortDescription", 100), (0, postsValidator_1.stringsInputValidator)("content", 1000), (0, express_validator_1.body)("blogId").custom(postsValidator_1.isValidBlogId), input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
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
    if (!isDeleted) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
});
//# sourceMappingURL=posts-router.js.map