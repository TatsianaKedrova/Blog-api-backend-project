import smtpTransport from "nodemailer-smtp-transport";
import nodemailer from "nodemailer";
import { UserDBType } from "../dto/usersDTO/usersDTO";

const emailSender = process.env.AUTH_EMAIL;
const appPassword = process.env.AUTH_PASSWORD;

export const emailAdapter = {
  async sendEmail(email: string, html: string) {
    let transport = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: emailSender,
          pass: appPassword,
        },
      })
    );
    let mailOptions = {
      from: "Baletrot",
      to: email,
      subject: "Email confirmation code",
      html,
    };

    // async..await is not allowed in global scope, must use a wrapper
    const sendEmailProcess = async () => {
      transport.verify((error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Ready for messages");
          console.log(success);
        }
      });
      await transport.sendMail(mailOptions);
      console.log("Email sent successfully");
    };
    await sendEmailProcess().catch(console.error);
  },
  async sendConfirmationEmail(user: UserDBType) {},
};
