import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
});
