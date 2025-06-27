import { ZodSchema } from 'zod';

export type SchemaOptions = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export function Schema(options: SchemaOptions): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata('custom:schema', options, target, propertyKey);
  };
}
