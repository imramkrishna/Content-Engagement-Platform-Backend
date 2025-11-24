import Joi from "joi";

export const commentValidation = {
  create: () =>
    Joi.object({
      newsId: Joi.number().required(),
      senderId: Joi.number().required(),
      comment: Joi.string().required(),
    }),
  update: () =>
    Joi.object({
      comment: Joi.string().required(),
    }),
};
