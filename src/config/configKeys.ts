import "dotenv/config";
import Joi from "joi";

const schema = Joi.object({
  PORT: Joi.string().required(),
  DB_URL: Joi.string().required(),
});

const configKeys = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL || '',
};

const isValidated = schema.validate(configKeys);

if (!!isValidated.error) {
    throw new Error(isValidated.error.message)
}

export { configKeys };
