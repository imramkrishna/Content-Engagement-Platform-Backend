import Joi from "joi";

const validationSchema = Joi.object({
  categoryIds: Joi.array().items(Joi.number()).min(3).required(),
  createdBy: Joi.number().optional(),
  sessionId: Joi.string().optional(),
});

export default {
  validationSchema,
};
