import smtpTransport from "nodemailer-smtp-transport";
import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(email: string, html: string) {
    let transport = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: "Baletrot@gmail.com",
          pass: "cfgmnhpvlihkzmom",
        },
      })
    );
    let mailOptions = {
      from: "Baletrot <Baletrot@gmail.com>",
      to: email,
      subject: "Email confirmation code",
      html,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error.message);
      }
      console.log("Email sent: " + info.response);
    });
  },
};
