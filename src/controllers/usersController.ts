import { StatusCodes } from "http-status-codes";
import { Paginator } from "../dto/common/PaginatorModel";
import {
  RequestBodyModel,
  RequestQueryParamsModel,
  RequestWithURIParam,
} from "../dto/common/RequestModels";
import {
  UserInputModel,
  UserViewModel,
  UsersQueryParams,
} from "../dto/usersDTO/usersDTO";
import { Response } from "express";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { usersService } from "../domain/users-service";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";

export const getAllUsers = async (
  req: RequestQueryParamsModel<UsersQueryParams>,
  res: Response<Paginator<UserViewModel>>
) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    searchEmailTerm = "",
    searchLoginTerm = "",
    sortBy = "createdAt",
    sortDirection = "desc",
  } = req.query;
  const allUsers = await usersQueryRepository.getUsers(
    Number(pageNumber),
    sortBy,
    Number(pageSize),
    sortDirection,
    searchEmailTerm,
    searchLoginTerm
  );
  res.status(StatusCodes.OK).send(allUsers);
};

export const addNewUserBySuperAdmin = async (
  req: RequestBodyModel<UserInputModel>,
  res: Response<UserViewModel>
) => {
  const newUser = await usersService.createUser(
    req.body.email,
    req.body.login,
    req.body.password,
    null,
    true,
    null
  );
  res.status(StatusCodes.CREATED).send(newUser);
};

export const deleteUser = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response
) => {
  const deletedUser = await usersService.deleteUser(req.params.id);
  if (!deletedUser) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};
