import Joi from "joi";

export const validation = Joi.object({
  poll: Joi.boolean().default(false),
  pollTitle: Joi.string().when("poll", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  question: Joi.string().when("poll", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  answers: Joi.array().items(Joi.string()).min(2).when("poll", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  status: Joi.string().default("Active"),
});

export const updateStatusValidation = Joi.object({
  status: Joi.string().valid("Completed", "Active"),
}).unknown(true);

export const createAnswerValidation = Joi.object({
  answerBy: Joi.array()
    .items(
      Joi.object({
        userId: Joi.number().required(),
        answerIndex: Joi.number().valid(0, 1).required(),
      })
    )
    .min(1)
    .required(),
});
