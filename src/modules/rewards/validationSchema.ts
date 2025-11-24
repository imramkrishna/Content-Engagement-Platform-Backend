import { imageInputSchema } from "@/utils/commonValidationSchema";
import Joi from "joi";

const validationSchema = Joi.object({
  productName: Joi.string().required(),
  productPrice: Joi.number().positive().required(),
  productDescription: Joi.string().required(),
  expirationDate: Joi.date().required(),
  image: imageInputSchema,
  status: Joi.boolean().default(true).optional(),
});

const updateValidationSchema = Joi.object({
  productName: Joi.string().optional(),
  productPrice: Joi.number().positive().optional(),
  productDescription: Joi.string().optional(),
  expirationDate: Joi.date().optional(),
  image: imageInputSchema,
  status: Joi.boolean().optional(),
});

export default { validationSchema, updateValidationSchema };
