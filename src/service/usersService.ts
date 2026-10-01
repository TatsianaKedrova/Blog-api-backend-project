import {
  UserDBType,
  UserInputModel,
  UserViewModel,
} from "../dto/usersDTO/usersDTO";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { ObjectId, WithId } from "mongodb";
import { authService } from "./authService";
import { bcryptService } from "../globals/bcrypt/bcryptService";
import { createConfirmationCode } from "../utils/auth-utils/createUserConfirmationCode";
import { createCodeExpirationDate } from "../utils/auth-utils/createCodeExpirationDate";
import { emailManager } from "../globals/email/email-manager";
import { createAppError } from "../utils/appErrors";
import { StatusCodes } from "http-status-codes";
import { transformUsersResponse } from "../utils/usersUtils/transformUsersResponse";

class UserService {
  async createUser(
    body: UserInputModel,
    isAddedBySuperAdmin: boolean,
  ): Promise<UserViewModel> {
    const { login, email, password } = body;

    const isUserNotExist = await usersQueryRepository.findUserByEmailAndLogin(
      login,
      email,
    );
    if (!isUserNotExist) {
      throw createAppError(
        "User with this Login or Email already exists",
        StatusCodes.BAD_REQUEST,
      );
    }

    const { passwordSalt, passwordHash } =
      await bcryptService._generateHash(password);
    const newUserData = new UserDBType(
      {
        passwordSalt,
        passwordHash,
        login,
        email,
        createdAt: creationDate(),
      },
      {
        confirmationCode: isAddedBySuperAdmin ? null : createConfirmationCode(),
        isConfirmed: isAddedBySuperAdmin ? true : false,
        expirationDate: isAddedBySuperAdmin ? null : createCodeExpirationDate(),
      },
      false,
    );

    const createdUserId =
      await usersCommandsRepository.createNewUser(newUserData);
    const newUser = transformUsersResponse({
      ...newUserData,
      _id: createdUserId,
    });
    emailManager.sendEmail(newUserData);
    await authService.createRefreshTokenBlacklistForUser(
      new ObjectId(createdUserId),
    );
    return newUser;
  }
  async deleteUser(id: string) {
    return await usersCommandsRepository.deleteUser(id);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<WithId<UserDBType> | null> {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    if (!user?.emailConfirmation.isConfirmed) {
      return null;
    }
    const isPasswordMatch = await bcryptService._passwordComparison(
      password,
      user.accountData.passwordHash,
    );
    if (!isPasswordMatch) {
      return null;
    }
    return user;
  }
}

export const usersService = new UserService();
