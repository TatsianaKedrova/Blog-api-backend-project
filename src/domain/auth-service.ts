import { UserInputModel } from "../dto/usersDTO/usersDTO";
import { emailManager } from "../managers/email-manager";
import { usersService } from "./users-service";
import { v1 } from "uuid";
import add from "date-fns/add";

const confirmationCode = v1();

export const authService = {
  async registerNewUser(body: UserInputModel) {
    const html = `
    <h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://google.com?code=your_confirmation_code'>complete registration</a>
    </p>
`;
    Promise.all([
      emailManager.sendEmail(body.email, html),
      await usersService.createUser(
        body.email,
        body.login,
        body.password,
        confirmationCode,
        false,
        add(new Date(), {
          hours: 1,
          minutes: 3,
        }).toISOString()
      ),
    ]).then((values) => console.log(values));
    // if (typeof sendEmailResult === "string") {
    //   await usersService.deleteUser(user.id);
    // }
  },
};
