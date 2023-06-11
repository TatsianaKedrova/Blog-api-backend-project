import { usersCommandsRepository } from "./../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { UserDBType, UserInputModel } from "../dto/usersDTO/usersDTO";
import { emailManager } from "../managers/email-manager";
import { usersService } from "./users-service";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { TFieldError } from "../dto/common/ErrorResponseModel";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { createConfirmationCode } from "../utils/auth-utils/create-user-confirmation-code";
import { createCodeExpirationDate } from "../utils/auth-utils/create-code-expiration-date";
import { UserAlreadyExistsError } from "../utils/errors-utils/UserAlreadyExistsError";
import { RegistrationError } from "../utils/errors-utils/registration-errors/RegistrationError";
import { IncorrectConfirmationCodeError } from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import { UpdateUserError } from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import { UserIsConfirmedError } from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import { ConfirmationCodeExpiredError } from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";

export const authService = {
  async registerNewUser(
    body: UserInputModel
  ): Promise<TFieldError | UserDBType> {
    const { login, email, password } = body;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await usersService._generateHash(
      password,
      passwordSalt
    );
    const newUser: UserDBType = {
      accountData: {
        passwordSalt,
        passwordHash,
        login,
        email,
        createdAt: creationDate(),
      },
      emailConfirmation: {
        confirmationCode: createConfirmationCode(),
        isConfirmed: false,
        expirationDate: createCodeExpirationDate(),
      },
    };
    const createUser = await usersCommandsRepository.createNewUser(newUser);
    if (!createUser) {
      return new UserAlreadyExistsError();
    } else {
      try {
        await emailManager.sendEmail(newUser);
        return newUser;
      } catch (error) {
        console.error(error);
        await usersCommandsRepository.deleteUser(createUser.id);
        return new RegistrationError();
      }
    }
  },
  async confirmCode(code: string): Promise<TFieldError | string> {
    const user = await usersQueryRepository.findUserByConfirmationCode(code);
    if (!user || user?.emailConfirmation.confirmationCode !== code) {
      return new IncorrectConfirmationCodeError();
    }
    if (user?.emailConfirmation.isConfirmed) {
      return new UserIsConfirmedError();
    }
    if (
      user?.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date().toISOString()
    ) {
      return new ConfirmationCodeExpiredError();
    } else {
      const updateIsConfirmedUser =
        await usersCommandsRepository.updateUserIsConfirmed(user._id);
      if (!updateIsConfirmedUser) {
        return new UpdateUserError();
      }
      return user.accountData.login;
    }
  },
  async resendEmail(email: string): Promise<TFieldError[]> {
    const errors: TFieldError[] = [];

    const user = await usersQueryRepository.findUserByEmail(email);
    if (!user) {
      errors.push({
        message: "User with such email doesn't exist",
        field: "registration-email-resending",
      });
    } else if (user.emailConfirmation.isConfirmed) {
      errors.push({
        message: "Email is already confirmed",
        field: "registration-email-resending",
      });
    } else {
      const resendEmailResult = await emailManager.resendEmailWithCode(user);
      if (!resendEmailResult) {
        errors.push({
          message: "Something went wrong with update process",
          field: "registration-email-resending",
        });
      }
    }
    return errors;
  },
};
