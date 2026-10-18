import { ObjectId, WithId } from "mongodb";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../../utils/html-utils/emailConfirmationCodeLetter";
import {
  createConfirmationCode,
  generateResetToken,
} from "../../utils/crypto/cryptoUtils";
import { createExpirationDate } from "../../utils/date/dateUtils";
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
      await sendEmail(user.accountData.email, html, "Email confirmation code");
    },

    async sendPasswordRecoveryLetter(userId: ObjectId, email: string) {
      const { rawToken, hashedToken } = generateResetToken();
      const newExpirationDate = createExpirationDate({ minutes: 15 });
      const html = passwordRecoveryLetter(rawToken);

      await sendEmail(email, html, "Password recovery code");
      await usersCommandsRepository.updateUserPassCodeAndPassExpiration(
        userId,
        hashedToken,
        newExpirationDate,
      );
    },
    async resendEmailWithCode(user: WithId<UserDBType>) {
      const newCode = createConfirmationCode();
      const newExpirationDate = createExpirationDate({ minutes: 15 });
      const html = htmlEmailConfirmationCodeLetter(newCode);

      await sendEmail(user.accountData.email, html, "Email confirmation code");
      await usersCommandsRepository.updateUserCodeAndExpirationDate(
        user._id,
        newCode,
        newExpirationDate,
      );
    },
  };
};
