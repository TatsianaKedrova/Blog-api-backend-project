"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = __importDefault(require("express"));
const basicAuth_1 = require("../middlewares/basicAuth");
const blogsValidator_1 = require("../utils/blogs-utils/blogs-validator/blogsValidator");
const responseErrorValidationMiddleware_1 = require("../middlewares/responseErrorValidationMiddleware");
const blogsController_1 = require("../controllers/blogsController");
const validateObjectIdParams_1 = require("../utils/common-utils/validateObjectIdParams");
exports.blogsRouter = express_1.default.Router({});
//TODO: GET LIST OF BLOGS
exports.blogsRouter.get("/", blogsController_1.getBlogs);
//TODO: GET BLOG BY ID
exports.blogsRouter.get("/:id", validateObjectIdParams_1.validateObjectIdParams, blogsController_1.getBlogsById);
//TODO: CREATE A NEW BLOG
exports.blogsRouter.post("/", basicAuth_1.basicAuthMiddleware, blogsValidator_1.blogsValidator, responseErrorValidationMiddleware_1.responseErrorValidationMiddleware, blogsController_1.createNewBlog);
//TODO: UPDATE BLOG BY ID
exports.blogsRouter.put("/:id", basicAuth_1.basicAuthMiddleware, validateObjectIdParams_1.validateObjectIdParams, blogsValidator_1.blogsValidator, responseErrorValidationMiddleware_1.responseErrorValidationMiddleware, blogsController_1.updateBlogById);
//TODO: DELETE BLOG BY ID
exports.blogsRouter.delete("/:id", basicAuth_1.basicAuthMiddleware, validateObjectIdParams_1.validateObjectIdParams, blogsController_1.deleteBlogById);
//# sourceMappingURL=blogs-router.js.map