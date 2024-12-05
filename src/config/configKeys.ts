import "dotenv/config";
import Joi from "joi";

// For early env validations
const schema = Joi.object({
  PORT: Joi.string().required(),
  DB_URL: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});

const configKeys = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL || "",
  API_VERSION: process.env.API_VERSION,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};

const isValidated = schema.validate(configKeys);

if (!!isValidated.error) {
  throw new Error(isValidated.error.message);
}

export { configKeys };
