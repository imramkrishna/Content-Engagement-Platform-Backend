import {
  imageInputSchema,
  languageSchema,
} from "@/utils/commonValidationSchema";
import Joi from "joi";

const validationSchema = Joi.object({
  title: languageSchema.required(),
  categoryId: Joi.number().optional(),
  categoryIds: Joi.array().items().min(1).required(),
  status: Joi.string().valid("Draft", "Published").default("Draft"),
  content: languageSchema.required(),
  image: imageInputSchema,
  images: Joi.array().items(imageInputSchema).required(),
  infos: Joi.object({
    date: Joi.date().allow(null, "").optional(),
    newsSource: languageSchema.optional(),
    newsSourceLink: languageSchema.optional(),
    newsExpiry: Joi.date().allow(null, "").optional(),
    imageSource: languageSchema.optional(),
    author: languageSchema.optional(),
  }).optional(),
  isActive: Joi.boolean().optional(),
  isTrending: Joi.boolean().default(false).optional(),
  poll: Joi.object({
    title: languageSchema.required(),
    question: languageSchema.required(),
    answers: Joi.array().items(languageSchema).min(2).required(),
  }).optional(),
});

const updateStatusValidationSchema = Joi.object({
  status: Joi.string()
    .valid("Draft", "Published", "Schedule")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be one of Draft, Published, or Schedule",
    }),

  publishDate: Joi.date().optional().messages({
    "date.base": "Publish date must be a valid date",
  }),
});
const updateValidationSchema = Joi.object({
  title: languageSchema.optional(),
  categoryId: Joi.number().optional(),
  categoryIds: Joi.array().optional(),
  status: Joi.string().valid("Draft", "Published").default("Draft"),
  content: languageSchema.optional(),
  image: imageInputSchema.optional(),
  images: Joi.array().items(imageInputSchema).optional(),
  infos: Joi.object({
    date: Joi.date().allow(null, "").optional(),
    newsSource: languageSchema.optional(),
    newsSourceLink: languageSchema.optional(),
    newsExpiry: Joi.date().allow(null, "").optional(),
    imageSource: languageSchema.optional(),
    author: languageSchema.optional(),
  }).optional(),
  isActive: Joi.boolean().optional(),
  poll: Joi.object({
    title: languageSchema.required(),
    question: languageSchema.required(),
    answers: Joi.array().items(languageSchema).min(2).required(),
  }).optional(),
  isTrending: Joi.boolean().optional(),
});

export default {
  validationSchema,
  updateStatusValidationSchema,
  updateValidationSchema,
};
