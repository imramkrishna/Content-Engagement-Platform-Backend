import Joi from "joi";

const validationSchema = Joi.object({
  email: Joi.string().required(),
  purpose: Joi.string().required(),
});
const verifyValidationSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.string().length(4).required(),
  token: Joi.string(),
});

export default { validationSchema, verifyValidationSchema };
