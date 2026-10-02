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
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { UsersService } from "../service/usersService";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";

class UsersController {
  usersService: UsersService;
  usersQueryRepository: UsersQueryRepository;

  constructor() {
    this.usersService = new UsersService();
    this.usersQueryRepository = new UsersQueryRepository();
  }
  async getAllUsers(
    req: RequestQueryParamsModel<UsersQueryParams>,
    res: Response<Paginator<UserViewModel>>,
  ) {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm = "",
      searchLoginTerm = "",
      sortBy = "createdAt",
      sortDirection = "desc",
    } = req.query;
    const allUsers = await this.usersQueryRepository.getUsers(
      Number(pageNumber),
      sortBy,
      Number(pageSize),
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    );
    res.status(StatusCodes.OK).send(allUsers);
  }
  async addNewUserBySuperAdmin(
    req: RequestBodyModel<UserInputModel>,
    res: Response<UserViewModel>,
  ) {
    const newUser = await this.usersService.createUser(req.body, true);

    res.status(StatusCodes.CREATED).send(newUser as UserViewModel);
  }
  async deleteUser(req: RequestWithURIParam<URIParamsRequest>, res: Response) {
    const deletedUser = await this.usersService.deleteUser(req.params.id);
    if (!deletedUser) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
}

export const usersController = new UsersController();
