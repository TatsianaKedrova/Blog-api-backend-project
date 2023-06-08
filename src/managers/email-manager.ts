import { emailAdapter } from "../adapters/email-adapter";
import { UserDBType } from "../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../utils/html-utils/html-email-confirmation-code-letter";

export const emailManager = {
  // async resendEmailWithCode(user: UserDBType) {
  //   await emailAdapter.resendEmailWithCode(user);
  // },
  async sendEmail(user: UserDBType) {
    const code = user.emailConfirmation.confirmationCode;
    const html = htmlEmailConfirmationCodeLetter(code);
    await emailAdapter.sendEmail(user.accountData.email, html);
  },
};
