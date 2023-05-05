import {
  UserDBType,
  UserViewModel,
} from "../dto/usersDTO/usersDTO";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";

export const usersService = {
  async createUser(
    email: string,
    login: string,
    password: string
  ): Promise<UserViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UserDBType = {
      passwordSalt,
      passwordHash,
      login,
      email,
      createdAt: creationDate(),
    };
    return await usersCommandsRepository.createNewUser(newUser);
  },
  async deleteUser(id: string) {
    return await usersCommandsRepository.deleteUser(id);
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return false;
    }
    return true;
  },
};