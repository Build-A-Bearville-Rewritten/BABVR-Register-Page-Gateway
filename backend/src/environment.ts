import Joi, { type ObjectSchema } from 'joi';

let variables: unknown;

const environmentSchema: ObjectSchema<unknown> = Joi.object({
  ALLOWED_REDIRECT_HOSTS: Joi.array().default(['localhost']),
  PORT: Joi.number().default(3000),
  SHOULD_ENFORCE_HTTPS: Joi.boolean().default(false)
}).unknown(true);

export function getEnvironmentVariable<T>(key: string): T | undefined {
  // @ts-expect-error The object may get not initialized yet
  return variables[key];
}

export function validateEnvironment() {
  const { error, value } = environmentSchema.validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  variables = value;
}
