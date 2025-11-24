import nodemailer from "nodemailer";
import env from "./env";

const transporter = nodemailer.createTransport({
  service: env.MAIL_SERVICE,
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
});

export default transporter;
