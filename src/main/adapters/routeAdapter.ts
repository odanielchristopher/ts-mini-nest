import { RequestHandler } from 'express';
import { ZodError } from 'zod';

import { SchemaOptions } from '../../kernel/decorators/Schema';
import { Constructor } from '../../shared/types/Constructor';
import { Response } from '../../shared/types/Response';

export function routeAdapter(
  impl: Constructor,
  controller: any,
  handler: string,
): RequestHandler {
  const schema: SchemaOptions | undefined = Reflect.getMetadata(
    'custom:schema',
    impl.prototype,
    handler,
  );

  return async (request, response) => {
    try {
      // Faz parse do corpo, se houver schema
      if (schema?.body) request.body = schema.body.parse(request.body);
      if (schema?.params) request.params = schema.params.parse(request.params);
      if (schema?.query) request.query = schema.query.parse(request.query);

      // Chama o handler original
      const { code, body }: Response<any> = await controller[handler](request);

      response.status(code).send(body);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).send({ error: error.issues });
      }

      console.log(error);
      response.status(500).send({ error: 'Internal Server Error!' });
    }
  };
}
