import Joi from "joi";
import Constant from "./constant";

const imageInputSchema = Joi.alternatives().try(
  Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions)
      .required(),
    id: Joi.number().optional(),
    filename: Joi.string().optional(),
  }).optional(),
  Joi.string().pattern(/^uploads\//)
);
const languageSchema = Joi.object({
  en: Joi.string().allow("").allow(null),
  np: Joi.string().allow("").allow(null),
});

export { imageInputSchema, languageSchema };
