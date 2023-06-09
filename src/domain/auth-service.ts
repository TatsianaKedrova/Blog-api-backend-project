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

export const authService = {
  async registerNewUser(body: UserInputModel): Promise<TFieldError[]> {
    const errors: TFieldError[] = [];
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
      errors.push({
        message:
          "User with the given email or login already exists",
        field: "registration",
      });
    } else {
      try {
        await emailManager.sendEmail(newUser);
      } catch (error) {
        console.error(error);
        await usersCommandsRepository.deleteUser(createUser.id);
        errors.push({
          message:
            "Something went wrong with registration/ User was not created",
          field: "registration",
        });
      }
    }
    return errors;
  },
  async confirmCode(code: string): Promise<TFieldError[]> {
    const errors: TFieldError[] = [];
    const user = await usersQueryRepository.findUserByConfirmationCode(code);
    if (!user) {
      errors.push({
        message: "Code is incorrect or has already been applied",
        field: "registration-confirmation",
      });
    } else if (user?.emailConfirmation.confirmationCode !== code) {
      errors.push({
        message: "Code is incorrect",
        field: "registration-confirmation",
      });
    } else if (user?.emailConfirmation.isConfirmed) {
      errors.push({
        message: "Code has already been applied",
        field: "registration-confirmation",
      });
    } else if (
      user?.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date().toISOString()
    ) {
      errors.push({
        message: "Code is expired",
        field: "registration-confirmation",
      });
    } else {
      const updateIsConfirmedUser =
        await usersCommandsRepository.updateUserIsConfirmed(user._id);
      if (!updateIsConfirmedUser) {
        errors.push({
          message: "Something went wrong with update operation",
          field: "registration-confirmation",
        });
      }
    }
    return errors;
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
