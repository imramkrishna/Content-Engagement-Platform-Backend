import { ROOT_PATH } from "@/constant";
import { resolve } from "path";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import fs from "fs";
import mail from "@/config/mail";
import env from "@/config/env";
const handlebarsWithAccess = allowInsecurePrototypeAccess(Handlebars);

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: `"Gistfeed" <${env.MAIL_USER}>`,
      to,
      subject,
      html,
    };
    await mail.sendMail(mailOptions);
  } catch (err: any) {
    throw new Error(err);
  }
};

const generateTemplate = async (data: any, template: string) => {
  const templatePath = resolve(ROOT_PATH, `views/${template}.hbs`);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const templateCompile = handlebarsWithAccess.compile(templateContent);
  const html = templateCompile(data);
  return html;
};

export default {
  sendMail,
  generateTemplate,
};
