import Joi from "joi";
const passwordValidationSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string(),
});

const validationSchema = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  permissions: Joi.array()
    .items(Joi.string().valid("news", "notification", "poll"))
    .optional(),
});

const loginValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  deviceToken: Joi.string().optional(),
  host: Joi.string().optional(),
  userAgent: Joi.string().optional(),
});

const updateValidationSchema = Joi.object({
  isActive: Joi.boolean().optional(),
});

export default {
  passwordValidationSchema,
  loginValidationSchema,
  validationSchema,
  updateValidationSchema,
};
