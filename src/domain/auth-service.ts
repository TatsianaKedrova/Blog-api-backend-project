import { usersCommandsRepository } from "./../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { UserDBType, UserInputModel } from "../dto/usersDTO/usersDTO";
import { emailManager } from "../managers/email-manager";
import { usersService } from "./users-service";
import { v1 } from "uuid";
import add from "date-fns/add";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

const confirmationCode = v1();

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
          hours: 1,
          minutes: 3,
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
};
