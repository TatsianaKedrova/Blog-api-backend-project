import { WithId } from "mongodb";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../../utils/html-utils/html-email-confirmation-code-letter";
import { createConfirmationCode } from "../../utils/auth-utils/createUserConfirmationCode";
import { createCodeExpirationDate } from "../../utils/auth-utils/createCodeExpirationDate";
import { emailAdapter } from "./email-adapter";
import { EmailManagerDeps } from "../../dto/common/EmailDTO";
import { UsersCommandsRepository } from "../../repositories/commands-repository/usersCommandsRepository";
import { UsersQueryRepository } from "../../repositories/query-repository/usersQueryRepository";

const usersCommandsRepository = new UsersCommandsRepository();
const usersQueryRepository = new UsersQueryRepository();

//Factory Function
const createEmailManager = ({
  usersCommandsRepository,
  usersQueryRepository,
}: EmailManagerDeps) => {
  //Put sendEmail here to have Lexical Closure instead of object context with "this"
  async function sendEmail(user: UserDBType) {
    const code = user.emailConfirmation.confirmationCode;
    const html = htmlEmailConfirmationCodeLetter(code);
    await emailAdapter.sendEmail(user.accountData.email, html);
  }
  return {
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

      await sendEmail(foundUpdatedUser);
      return true;
    },
    sendEmail,
  };
};

export const emailManager = createEmailManager({
  usersCommandsRepository,
  usersQueryRepository,
});
