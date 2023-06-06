import { usersCommandsRepository } from "./../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { UserDBType, UserInputModel } from "../dto/usersDTO/usersDTO";
import { emailManager } from "../managers/email-manager";
import { usersService } from "./users-service";
import add from "date-fns/add";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import crypto from "crypto";
import { TFieldError } from "../dto/common/ErrorResponseModel";

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
    const user = await usersCommandsRepository.findUserByConfirmationCode(code);
    if (
      user &&
      user.emailConfirmation.confirmationCode === code &&
      user.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate > new Date().toISOString()
    ) {
      const updateIsConfirmedUser =
        await usersCommandsRepository.updateUserIsConfirmed(user._id);
      if (!updateIsConfirmedUser) {
        errors.push({
          message: "Something went wrong with update operation",
          field: "registration-confirmation",
        });
      }
    } else if (!user) {
      errors.push({
        message: "Code is incorrect or has already been applied",
        field: "registration-confirmation",
      });
    } else if (
      user.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date().toISOString()
    ) {
      errors.push({
        message: "Code is expired",
        field: "registration-confirmation",
      });
    }
    return errors;
  },
};
