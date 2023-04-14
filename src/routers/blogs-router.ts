import express from "express";

import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogsValidator/blogsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  createNewBlog,
  deleteBlogById,
  getBlogs,
  getBlogsById,
  updateBlogById,
} from "../controllers/blogsController";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", getBlogs);

//TODO: GET BLOG BY ID
blogsRouter.get("/:id", getBlogsById);

//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  createNewBlog
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  updateBlogById
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete("/:id", basicAuthMiddleware, deleteBlogById);
