import { StatusCodes } from "http-status-codes";
import express, { Response } from "express";
import { db } from "../temporal-database/project-db";
import { BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
export const blogsRouter = express.Router({});

blogsRouter.get("/", (req, res: Response<BlogViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.blogs);
});

blogsRouter.get("/:id", (req, res: Response<BlogViewModel>) => {
  const foundBlogById = db.blogs.find(
    (element) => element.id === req.params.id
  );
  if (!foundBlogById) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundBlogById);
  }
});

blogsRouter.post("/", (req, res: Response<BlogViewModel>) => {});
