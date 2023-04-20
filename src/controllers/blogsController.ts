import { Request, Response } from "express";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { StatusCodes } from "http-status-codes";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { blogsService } from "../domain/blogs-service";

// @desc Get all blogs
// @route GET /api/blogs
// @access Public
export const getBlogs = async (
  req: Request,
  res: Response<BlogViewModel[]>
) => {
  const blogs: BlogViewModel[] = await blogsService.findBlogs();
  res.status(StatusCodes.OK).send(blogs);
};

// @desc Get blog by ID
// @route GET /api/blogs/:id
// @access Public
export const getBlogsById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<BlogViewModel>
) => {
  const foundBlog = await blogsService.findBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundBlog);
  }
};

// @desc Create new blog
// @route POST /api/blogs
// @access Private
export const createNewBlog = async (
  req: RequestBodyModel<BlogInputModel>,
  res: Response<BlogViewModel | TApiErrorResultObject>
) => {
  debugger;
  const newBlog = await blogsService.createNewBlog(req.body);
  res.status(StatusCodes.CREATED).send(newBlog);
};

// @desc Update blog by ID
// @route PUT /api/blogs/:id
// @access Private
export const updateBlogById = async (
  req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
  res: Response<TApiErrorResultObject>
) => {
  const updatedBlog = await blogsService.updateBlogById(
    req.params.id,
    req.body
  );
  if (!updatedBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

// @desc Delete blog by ID
// @route DELETE /api/blogs/:id
// @access Private
export const deleteBlogById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response
) => {
  const foundBlog = await blogsService.deleteBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else res.sendStatus(StatusCodes.NO_CONTENT);
};
