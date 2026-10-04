import { UsersCommandsRepository } from "../../repositories/commands-repository/usersCommandsRepository";
import { UsersQueryRepository } from "../../repositories/query-repository/usersQueryRepository";

export interface EmailManagerDeps {
  usersCommandsRepository: UsersCommandsRepository;
  usersQueryRepository: UsersQueryRepository;
};
