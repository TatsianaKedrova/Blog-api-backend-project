import { WithId } from "mongodb";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../../utils/html-utils/html-email-confirmation-code-letter";
import { createConfirmationCode } from "../../utils/auth-utils/createUserConfirmationCode";
import { usersCommandsRepository } from "../../repositories/commands-repository/usersCommandsRepository";
import { createCodeExpirationDate } from "../../utils/auth-utils/createCodeExpirationDate";
import { usersQueryRepository } from "../../repositories/query-repository/usersQueryRepository";
import { emailAdapter } from "./email-adapter";

export const emailManager = {
  async resendEmailWithCode(user: WithId<UserDBType>): Promise<boolean> {
    const newCode = createConfirmationCode();
    const newExpirationDate = createCodeExpirationDate();

    await usersCommandsRepository.updateUserCodeAndExpirationDate(
      user._id,
      newCode,
      newExpirationDate,
    );
    const foundUpdatedUser = await usersQueryRepository.findUserById(
      user._id.toString(),
    );
    if (!foundUpdatedUser) return false;

    emailManager.sendEmail(foundUpdatedUser);
    return true;
  },
  async sendEmail(user: UserDBType) {
    const code = user.emailConfirmation.confirmationCode;
    const html = htmlEmailConfirmationCodeLetter(code);
    await emailAdapter.sendEmail(user.accountData.email, html);
  },
};
