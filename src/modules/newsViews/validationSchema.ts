import Joi from "joi";

const validationSchema = Joi.object({
  newsId: Joi.number().required(),
  userId: Joi.number().optional(),
  sessionId: Joi.string().required(),
});

export default {
  validationSchema,
};
