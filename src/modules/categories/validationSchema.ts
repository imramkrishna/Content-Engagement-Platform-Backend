import { imageInputSchema } from "@/utils/commonValidationSchema";
import Joi from "joi";

const validationSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().required(),
    np: Joi.string().required(),
  }),
  image: imageInputSchema,
  isActive: Joi.boolean().optional(),
});

export default { validationSchema };
