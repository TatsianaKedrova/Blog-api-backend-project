"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = __importDefault(require("express"));
const basicAuth_1 = require("../middlewares/basicAuth");
exports.postsRouter = express_1.default.Router({});
const postsValidator_1 = require("../utils/posts-validator/postsValidator");
const responseErrorValidationMiddleware_1 = require("../middlewares/responseErrorValidationMiddleware");
const postsController_1 = require("../controllers/postsController");
//TODO: GET LIST OF POSTS
exports.postsRouter.get("/", postsController_1.getPosts);
//TODO: GET POST BY ID
exports.postsRouter.get("/:id", postsController_1.getPostsById);
//TODO: CREATE A NEW POST
exports.postsRouter.post("/", basicAuth_1.basicAuthMiddleware, postsValidator_1.postsValidator, responseErrorValidationMiddleware_1.responseErrorValidationMiddleware, postsController_1.createNewPost);
//TODO: UPDATE POST BY ID
exports.postsRouter.put("/:id", basicAuth_1.basicAuthMiddleware, postsValidator_1.postsValidator, responseErrorValidationMiddleware_1.responseErrorValidationMiddleware, postsController_1.updatePostById);
//TODO: DELETE POST BY ID
exports.postsRouter.delete("/:id", basicAuth_1.basicAuthMiddleware, postsController_1.deletePostById);
//# sourceMappingURL=posts-router.js.map