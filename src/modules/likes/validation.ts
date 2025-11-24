import Joi from "joi";

export const likeValidation = {
  create: () =>
    Joi.object({
      newsId: Joi.number().required(),
      senderId: Joi.number().required(),
    }),
};
