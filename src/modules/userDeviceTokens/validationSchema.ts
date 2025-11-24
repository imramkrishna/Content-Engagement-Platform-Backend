import Joi from "joi";

const tokenArray = Joi.array()
  .items(Joi.string().required().label("Token"))
  .min(1)
  .required()
  .label("Device Token");

const validationSchema = Joi.object({
  deviceToken: tokenArray,
  createdBy: Joi.number().optional(),
  sessionId: Joi.string().optional(),
});

export default {
  validationSchema,
};
