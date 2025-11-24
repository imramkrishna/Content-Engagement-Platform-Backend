import { imageInputSchema } from "@/utils/commonValidationSchema";
import Joi from "joi";

const createValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNo: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  isActive: Joi.boolean().default(true).optional(),
  token: Joi.string().optional(),
  language: Joi.string().valid("np", "en").required(),
  image: imageInputSchema,
});

const updateValidationSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  image: imageInputSchema,
  preferences: Joi.array().optional(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceToken: Joi.string().optional(),
});

const changePasswordValidationSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
const forgotPasswordValiationSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
  email: Joi.string().required(),
  token: Joi.string().required(),
});
export default {
  createValidationSchema,
  updateValidationSchema,
  loginValidationSchema,
  forgotPasswordValiationSchema,
  changePasswordValidationSchema,
};
