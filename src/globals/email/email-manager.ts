import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../../utils/html-utils/emailConfirmationCodeLetter";
import {
  createConfirmationCode,
  generateResetToken,
} from "../../utils/crypto/cryptoUtils";
import { createExpirationDate } from "../../utils/date/dateUtils";
import { EmailManagerDeps } from "../../dto/common/EmailDTO";
import { passwordRecoveryLetter } from "../../utils/html-utils/passwordRecoveryLetter";
import { emailAdapter } from "./email-adapter";
import { Types } from "mongoose";

//Factory Function
export const createEmailManager = ({
  usersCommandsRepository,
}: EmailManagerDeps) => {
  return {
    async sendEmailConfirmationLetter(user: Omit<UserDBType, "_id">) {
      const code = user.emailConfirmation.confirmationCode;
      const html = htmlEmailConfirmationCodeLetter(code);
      await emailAdapter.sendEmail(
        user.accountData.email,
        html,
        "Email confirmation code",
      );
    },

    async sendPasswordRecoveryLetter(userId: Types.ObjectId, email: string) {
      const { rawToken, hashedToken } = generateResetToken();
      const newExpirationDate = createExpirationDate({ minutes: 15 });
      const html = passwordRecoveryLetter(rawToken);

      await usersCommandsRepository.updateUserPassResetCodeAndExpiration(
        userId,
        hashedToken,
        newExpirationDate,
      );

      await emailAdapter.sendEmail(email, html, "Password recovery code");
    },
    async resendEmailWithCode(user: UserDBType) {
      const newCode = createConfirmationCode();
      const newExpirationDate = createExpirationDate({ minutes: 15 });
      const html = htmlEmailConfirmationCodeLetter(newCode);

      await emailAdapter.sendEmail(
        user.accountData.email,
        html,
        "Email confirmation code",
      );
      await usersCommandsRepository.updateConfirmationCodeAndExpirationDate(
        user._id.toString(),
        newCode,
        newExpirationDate,
      );
    },
  };
};
