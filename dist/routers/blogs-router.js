"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_1 = __importDefault(require("express"));
const project_db_1 = require("../temporal-database/project-db");
const blogs_repository_1 = require("../repositories/blogs-repository");
const responseErrorUtils_1 = require("../utils/common-utils/responseErrorUtils");
exports.blogsRouter = express_1.default.Router({});
//TODO: GET LIST OF BLOGS
exports.blogsRouter.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send(project_db_1.db.blogs);
});
//TODO: GET BLOG BY ID
exports.blogsRouter.get("/:id", (req, res) => {
    const foundBlog = blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).send(foundBlog);
    }
});
//TODO: CREATE A NEW BLOG
exports.blogsRouter.post("/", (req, res) => {
    const errors = [];
    //validation
    if (errors.length > 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
    }
    //401 unauthorized
    res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    //OK
    const newBlog = blogs_repository_1.blogsRepository.createNewBlog(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).send(newBlog);
});
//TODO: UPDATE BLOG BY ID
exports.blogsRouter.put("/:id", (req, res) => {
    //validation
    res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    //401 unauthorized
    res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    //NOT_FOUND
    const updatedBlog = blogs_repository_1.blogsRepository.updateBlogById(req.params.id);
    if (!updatedBlog) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
});
//TODO: DELETE BLOG BY ID
exports.blogsRouter.delete("/:id", (req, res) => {
    //401 unauthorized
    res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    //NOT_FOUND
    const foundBlog = blogs_repository_1.blogsRepository.deleteBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
});
//# sourceMappingURL=blogs-router.js.map