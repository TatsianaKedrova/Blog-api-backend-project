import {
  UserDBType,
  UserInputModel,
  UserViewModel,
} from "../dto/usersDTO/usersDTO";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { UsersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { ObjectId, WithId } from "mongodb";
import { authService } from "./authService";
import { createConfirmationCode } from "../utils/auth-utils/createUserConfirmationCode";
import { createCodeExpirationDate } from "../utils/auth-utils/createCodeExpirationDate";
import { emailManager } from "../globals/email/email-manager";
import { createAppError } from "../utils/appErrors";
import { StatusCodes } from "http-status-codes";
import { transformUsersResponse } from "../utils/usersUtils/transformUsersResponse";
import {
  comparePasswords,
  generateHash,
} from "../globals/bcrypt/bcryptService";

export class UsersService {
  usersCommandsRepository: UsersCommandsRepository;
  usersQueryRepository: UsersQueryRepository;

  constructor() {
    this.usersCommandsRepository = new UsersCommandsRepository();
    this.usersQueryRepository = new UsersQueryRepository();
  }

  async createUser(
    body: UserInputModel,
    isAddedBySuperAdmin: boolean,
  ): Promise<UserViewModel> {
    const { login, email, password } = body;

    const isCredentialsTaken =
      await this.usersQueryRepository.findUserByEmailAndLogin(login, email);
    if (isCredentialsTaken) {
      throw createAppError(
        "User with this Login or Email already exists",
        StatusCodes.BAD_REQUEST,
      );
    } else {
      const { passwordSalt, passwordHash } = await generateHash(password);
      const newUserData = new UserDBType(
        {
          passwordSalt,
          passwordHash,
          login,
          email,
          createdAt: creationDate(),
        },
        {
          confirmationCode: isAddedBySuperAdmin
            ? null
            : createConfirmationCode(),
          isConfirmed: isAddedBySuperAdmin ? true : false,
          expirationDate: isAddedBySuperAdmin
            ? null
            : createCodeExpirationDate(),
        },
        false,
      );

      const createdUserId =
        await this.usersCommandsRepository.createNewUser(newUserData);
      const newUser = transformUsersResponse({
        ...newUserData,
        _id: createdUserId,
      });
      await emailManager.sendEmail(newUserData);
      await authService.createRefreshTokenBlacklistForUser(
        new ObjectId(createdUserId),
      );
      return newUser;
    }
  }
  async deleteUser(id: string) {
    return await this.usersCommandsRepository.deleteUser(id);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<WithId<UserDBType> | null> {
    const user =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    if (!user?.emailConfirmation.isConfirmed) {
      return null;
    }
    const isPasswordMatch = await comparePasswords(
      password,
      user.accountData.passwordHash,
    );
    if (!isPasswordMatch) {
      return null;
    }
    return user;
  }
}
