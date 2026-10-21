import {
  UserDBType,
  UserDBTypeWithId,
  UserInputModel,
  UserViewModel,
} from "../dto/usersDTO/usersDTO";
import { UsersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { UsersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { createConfirmationCode } from "../utils/crypto/cryptoUtils";
import { createExpirationDate, creationDate } from "../utils/date/dateUtils";
import { createAppError } from "../utils/appErrors";
import { StatusCodes } from "http-status-codes";
import { transformUsersResponse } from "../utils/usersUtils/transformUsersResponse";
import {
  comparePasswords,
  generateJWTHash,
} from "../globals/bcrypt/bcryptService";
import { AuthService } from "./authService";
import { inject, injectable } from "inversify";
import { createEmailManager } from "../globals/email/email-manager";
import { TYPES } from "../constants/tokens";
import { Types } from "mongoose";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersQueryRepository)
    protected readonly usersQueryRepository: UsersQueryRepository,
    @inject(UsersCommandsRepository)
    protected readonly usersCommandsRepository: UsersCommandsRepository,
    @inject(AuthService) protected readonly authService: AuthService,
    @inject(TYPES.EmailManager)
    private readonly emailManager: ReturnType<typeof createEmailManager>,
  ) {}

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
      const { passwordSalt, passwordHash } = await generateJWTHash(password);
      const newUserData = new UserDBType({
        accountData: {
          passwordSalt,
          passwordHash,
          login,
          email,
          createdAt: creationDate(),
        },
        emailConfirmation: {
          confirmationCode: isAddedBySuperAdmin
            ? null
            : createConfirmationCode(),
          isConfirmed: isAddedBySuperAdmin,
          expirationDate: isAddedBySuperAdmin
            ? null
            : createExpirationDate({ hours: 1 }),
        },
        isAddedBySuperAdmin: false,
      });

      const createdUserId =
        await this.usersCommandsRepository.createNewUser(newUserData);
      const transformedUserResponse = transformUsersResponse({
        ...newUserData,
        _id: createdUserId,
      });
      await this.emailManager.sendEmailConfirmationLetter(newUserData);
      await this.authService.createRefreshTokenBlacklistForUser(
        new Types.ObjectId(createdUserId),
      );
      return transformedUserResponse;
    }
  }
  async deleteUser(id: string) {
    return await this.usersCommandsRepository.deleteUser(id);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDBTypeWithId | null> {
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
