import { emailAdapter } from "../adapters/emailAdapter";
import { UserInputModel } from "../dto/usersDTO/usersDTO";

export const authService = {
  async registerNewUser(body: UserInputModel) {
    let link; /*<a href='https://somesite.com/confirm-email?code=your_confirmation_code'>*/
    const html = `
<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
    ${link} GREAT JOB YOU ARE DOING!!!</a>
</p>
`;
    await emailAdapter.sendEmail(body.email, html);
  },
};
