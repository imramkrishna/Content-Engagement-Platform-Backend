import { imageInputSchema } from "@/utils/commonValidationSchema";
import Joi from "joi";

export const adsValidation = {
  create: () =>
    Joi.object({
      category: Joi.object().required(),
      frequency: Joi.string().required(),
      title: Joi.string().required(),
      link: Joi.string().allow(null, ""),
      status: Joi.string().default("Active"),
      image: imageInputSchema,
    }),
  update: () =>
    Joi.object({
      category: Joi.object().optional(),
      frequency: Joi.string().optional(),
      title: Joi.string().optional(),
      link: Joi.string().allow(null, "").optional(),
      status: Joi.string().default("Active"),
      image: imageInputSchema,
    }),
  updateStatus: () =>
    Joi.object({
      status: Joi.string()
        .valid("Active", "Inactive")
        .default("Active")
        .required(),
    }),
};
