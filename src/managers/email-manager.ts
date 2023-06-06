import { emailAdapter } from "../adapters/email-adapter";
import { UserDBType } from "../dto/usersDTO/usersDTO";

export const emailManager = {
  // async sendEmailRecoveryMessage(user: UserDBType) {
  //   await emailAdapter.sendEmailRecoveryMessage(user);
  // },
  async sendEmail(user: UserDBType) {
    const code = user.emailConfirmation.confirmationCode;
    const html = `
    <h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://google.com?code=${code}'>complete registration</a>
    </p>
`;
    await emailAdapter.sendEmail(user.accountData.email, html);
  },
};
