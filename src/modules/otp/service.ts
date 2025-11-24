import Validation from "./validation";
import Repository from "./repository";
import Token from "@/utils/token";
import User from "@/modules/user/model";
import MailService from "@/modules/mails/service";
const send = async (input: any) => {
  try {
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (!!error) {
      throw new Error(error.details[0].message);
    }

    if (["Register", "ResetPassword"].includes(input?.purpose)) {
      const user: any = await User.findOne({
        where: { email: input.email },
      });
      if (!!user?.id && input?.purpose == "Register") {
        throw new Error("Already exist");
      }
      if (!user && input?.purpose == "ResetPassword") {
        throw new Error("User is not Registered");
      }
      const isEmail: boolean = await Repository.isValidEmail(input?.email);

      if (!!isEmail) {
        const otp = await Repository.generate();
        // const html = await MailService.generateTemplate(
        //   {
        //     otp: String(otp).split("").map(Number),
        //   },
        //   "email-otp"
        // );
        //await MailService.sendMail(input?.email, "Account Verification", html);
        await Repository.set(input?.email, otp);
        const response: any = {
          email: input.email,
          countryCode: input.countryCode,
          input: input?.purpose,
        };
        const token = await Token.generateTemp(
          {
            id: user?.id,
            type: input?.purpose,
            email: input?.email,
          },
          3
        );

        response.token = token;

        return response;
      } else {
        throw new Error("Invalid email");
      }
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const verify = async (input: any) => {
  try {
    const { error } = await Validation.verifyValidationSchema.validateAsync(
      input
    );
    if (error) {
      throw new Error(error.details[0].message);
    }
    const reverseToken = await Token.reverseTemp(input?.token);

    if (!reverseToken) {
      throw new Error("Invalid request");
    }
    reverseToken.verified = true;
    const token = await Token.generateTemp(reverseToken, 10);
    const email: string =
      !!(await Repository.isValidEmail(input?.email)) && input?.email;

    const otp: any = await Repository.get(email);
    if (parseInt(otp) == parseInt(input?.otp)) {
      return {
        email: input.email,
        verified: true,
        token: token,
      };
    } else {
      throw new Error("Verification Failed");
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
export default {
  send,
  verify,
};
