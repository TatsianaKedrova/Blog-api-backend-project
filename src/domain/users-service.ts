import { UserDBType, UserViewModel } from "../dto/usersDTO/usersDTO";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { WithId } from "mongodb";

export const usersService = {
  async createUser(
    email: string,
    login: string,
    password: string,
    confirmationCode: string | null,
    isConfirmed: boolean,
    expirationDate: string | null
  ): Promise<UserViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UserDBType = {
      accountData: {
        passwordSalt,
        passwordHash,
        login,
        email,
        createdAt: creationDate(),
      },
      emailConfirmation: {
        confirmationCode,
        isConfirmed,
        expirationDate,
      },
    };
    return await usersCommandsRepository.createNewUser(newUser);
  },
  async deleteUser(id: string) {
    return await usersCommandsRepository.deleteUser(id);
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
  async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<WithId<UserDBType> | null> {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const passwordHash = await this._generateHash(
      password,
      user.accountData.passwordSalt
    );
    if (user.accountData.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  },
};
