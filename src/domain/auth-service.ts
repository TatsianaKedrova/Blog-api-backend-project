import { usersCommandsRepository } from "./../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { UserDBType, UserInputModel } from "../dto/usersDTO/usersDTO";
import { emailManager } from "../managers/email-manager";
import { usersService } from "./users-service";
import add from "date-fns/add";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import crypto from "crypto";
import { TFieldError } from "../dto/common/ErrorResponseModel";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";

const confirmationCode = crypto.randomUUID();

export const authService = {
  async registerNewUser(body: UserInputModel): Promise<boolean> {
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
        confirmationCode,
        isConfirmed: false,
        expirationDate: add(new Date(), {
          days: 1,
        }).toISOString(),
      },
    };
    const createUser = await usersCommandsRepository.createNewUser(newUser);
    try {
      await emailManager.sendEmail(newUser);
      return true;
    } catch (error) {
      console.error(error);
      await usersCommandsRepository.deleteUser(createUser.id);
      return false;
    }
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
    const user = await usersQueryRepository.findUserByEmail(email);
    const errors: TFieldError[] = [];
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
      await emailManager.sendEmail(user);
    }
    return errors;
  },
};
