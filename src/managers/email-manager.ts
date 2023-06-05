import { emailAdapter } from "../adapters/email-adapter";
import { UserDBType } from "../dto/usersDTO/usersDTO";

export const emailManager = {
  // async sendEmailRecoveryMessage(user: UserDBType) {
  //   await emailAdapter.sendEmailRecoveryMessage(user);
  // },
  async sendEmail(email: string, message: string) {
    await emailAdapter.sendEmail(email, message);
  },
};
