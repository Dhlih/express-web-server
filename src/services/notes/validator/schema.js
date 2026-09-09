import Joi from "joi";

export const notePayloadSchema = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().required(),
});

export const noteQuerySchema = Joi.object({
  title: Joi.string().optional(),
});
