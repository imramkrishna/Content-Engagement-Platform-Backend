import constant from "@/utils/constant";
import Joi from "joi";

const imageInputSchema = Joi.object({
  base64: Joi.string().required(),
  extension: Joi.string()
    .valid(...constant.imageValidationExtensions)
    .required(),
});
const validationSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  file: imageInputSchema.optional(),
});

export default validationSchema;
