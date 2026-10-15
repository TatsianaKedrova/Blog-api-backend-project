import { ObjectId, WithId } from "mongodb";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../../utils/html-utils/emailConfirmationCodeLetter";
import { createConfirmationCode } from "../../utils/auth-utils/createUserConfirmationCode";
import { createCodeExpirationDate } from "../../utils/auth-utils/createCodeExpirationDate";
import { EmailManagerDeps } from "../../dto/common/EmailDTO";
import { passwordRecoveryLetter } from "../../utils/html-utils/passwordRecoveryLetter";
import { sendEmail } from "./email-adapter";

//Factory Function
export const createEmailManager = ({
  usersCommandsRepository,
}: EmailManagerDeps) => {
  return {
    async sendEmailConfirmationLetter(user: UserDBType) {
      const code = user.emailConfirmation.confirmationCode;
      const html = htmlEmailConfirmationCodeLetter(code);
      await sendEmail(user.accountData.email, html);
    },

    async sendPasswordRecoveryLetter(userId: ObjectId, email: string) {
      const newCode = createConfirmationCode();
      const newExpirationDate = createCodeExpirationDate();
      const html = passwordRecoveryLetter(newCode);

      await sendEmail(email, html);
      await usersCommandsRepository.updateUserPassCodeAndPassExpiration(
        userId,
        newCode,
        newExpirationDate,
      );
    },
    async resendEmailWithCode(user: WithId<UserDBType>) {
      const newCode = createConfirmationCode();
      const newExpirationDate = createCodeExpirationDate();
      const html = htmlEmailConfirmationCodeLetter(newCode);

      await sendEmail(user.accountData.email, html);
      await usersCommandsRepository.updateUserCodeAndExpirationDate(
        user._id,
        newCode,
        newExpirationDate,
      );
    },
  };
};
