import smtpTransport from "nodemailer-smtp-transport";
import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  html: string,
  subject: string,
) => {
  // if (process.env.NODE_ENV === "test") {
  //   console.log(`[TEST_EMAIL] To: ${email} | Subject: ${subject}`);
  //   console.log(`[TEST_EMAIL_CONTENT] ${html}`);
  // }

  const emailSender = process.env.AUTH_EMAIL;
  const appPassword = process.env.AUTH_PASSWORD;
  if (!emailSender || !appPassword) {
    console.error(
      "❌ Email configuration error: AUTH_EMAIL or AUTH_PASSWORD is not defined in .env",
    );
    return;
  }
  const transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: emailSender,
        pass: appPassword,
      },
    }),
  );
  const mailOptions = {
    from: `"Baletrot" <${emailSender}>`,
    to: email,
    subject: subject,
    html,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log("📨 Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Nodemailer failed to dispatch email:", error);
  }
};
