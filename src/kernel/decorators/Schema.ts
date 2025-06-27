import { z } from 'zod';

export type SchemaOptions = {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
};

const SCHEMA_METADATA_KEY = 'custom:schema';

export function Schema(options: SchemaOptions): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(SCHEMA_METADATA_KEY, options, target, propertyKey);
  };
}

export function getSchema(
  target: any,
  propertyKey: string,
): SchemaOptions | undefined {
  return Reflect.getMetadata(
    SCHEMA_METADATA_KEY,
    target.prototype,
    propertyKey,
  );
}
