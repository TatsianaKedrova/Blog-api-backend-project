import { StatusCodes } from "http-status-codes";
import express, { Response } from "express";
import { db } from "../temporal-database/project-db";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { blogsRepository } from "../repositories/blogs-repository";
import {
  TApiErrorResultObject,
  TFieldError,
} from "../dto/common/ErrorResponseModel";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { responseErrorFunction } from "../utils/common-utils/responseErrorUtils";
import { basicAuthMiddleware } from "../middleware/basicAuth";
export const blogsRouter = express.Router({});

blogsRouter.use(basicAuthMiddleware);

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", (req, res: Response<BlogViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.blogs);
});

//TODO: GET BLOG BY ID
blogsRouter.get(
  "/:id",
  (
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response<BlogViewModel>
  ) => {
    const foundBlog = blogsRepository.findBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).send(foundBlog);
    }
  }
);

//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  (
    req: RequestBodyModel<BlogInputModel>,
    res: Response<BlogViewModel | TApiErrorResultObject>
  ) => {
    const errors: TFieldError[] = [];
    //validation
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
    }
    res.set({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    const newBlog = blogsRepository.createNewBlog(req.body);
    res.status(StatusCodes.CREATED).send(newBlog);
  }
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  (
    req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
    res: Response<TApiErrorResultObject>
  ) => {
    const errors: TFieldError[] = [];

    //validation
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
    }
    //NOT_FOUND
    const updatedBlog = blogsRepository.updateBlogById(req.params.id);
    if (!updatedBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete(
  "/:id",
  (req: RequestWithURIParam<URIParamsRequest>, res: Response) => {
    //401 unauthorized
    // res.sendStatus(StatusCodes.UNAUTHORIZED);

    //NOT_FOUND
    const foundBlog = blogsRepository.deleteBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);
// fetch("http://localhost:3000/api/blogs/123", {method: "DELETE"}).then(res => res.json()).then(res => console.log(res))

// fetch("http://localhost:3000/api/blogs/456", {method: "DELETE", headers: {"authorization": "Basic YWRtaW46cXdlcnR5"}}).then(res => res.json()).then(res => console.log(res))

/*fetch("http://localhost:3000/api/blogs", {method: "POST", headers: {"Content-Type": "application/json",
      "Accept": "application/json"}, body: JSON.stringify({ name: "Tania",
    description: "She is such a pretty girl", 
    websiteUrl: "www.google.com"})}).then(res => res.json()).then(res => console.log(res))*/
