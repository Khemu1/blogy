import { CustomError } from "@/middlewares/error/CustomError";
import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  body: string
) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "465", 10),
      secure: true,
      auth: {
        user: process.env.EMAIL_AUTH_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_AUTH_PASS || "your-email-password",
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_AUTH_USER || "your-email@gmail.com",
      to: email,
      subject: subject,
      text: body,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent: " + email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new CustomError(
      "Failed to send email",
      500,
      "Check the email service configuration.",
      true
    );
  }
};
