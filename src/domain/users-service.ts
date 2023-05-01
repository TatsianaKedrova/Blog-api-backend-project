import { UserDBType, UserInputModel, UserViewModel } from "../dto/usersDTO/usersDTO";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
const saltRounds = 10;

export const usersService = {
  async createUser(body: UserInputModel): Promise<UserViewModel> {
    const { login, email, password } = body;
    const newUser: UserDBType = {
      login,
      email,
      createdAt: creationDate(),
    };
    return await usersCommandsRepository.createNewUser(newUser);
  },
  async deleteUser(id: string) {
    return await usersCommandsRepository.deleteUser(id);
  },
};
