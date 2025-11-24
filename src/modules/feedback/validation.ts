import Joi from "joi";

export const feedbackValidation = {
  create: () =>
    Joi.object({
      thought: Joi.string().required(),
      userId: Joi.number().required(),
    }),
  listByUser: () =>
    Joi.object({
      userId: Joi.number().required(),
    }),
};
