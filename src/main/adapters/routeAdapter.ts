import { RequestHandler } from 'express';
import { ZodError } from 'zod';

import { SchemaOptions } from '../../kernel/decorators/Schema';
import { Constructor } from '../../shared/types/Constructor';
import { Response } from '../../shared/types/Response';

export function routeAdapter(
  impl: Constructor,
  controller: any,
  methodName: string,
): RequestHandler {
  const schema: SchemaOptions | undefined = Reflect.getMetadata(
    'custom:schema',
    impl.prototype,
    methodName,
  );

  return async (request, response) => {
    try {
      // Faz parse do corpo, se houver schema

      const input = {
        body: schema?.body ? schema.body.parse(request.body) : undefined,
        params: schema?.params
          ? schema.params.parse(request.params)
          : undefined,
        query: schema?.query ? schema.query.parse(request.query) : undefined,
      };

      // Chama o handler original
      const { code, body }: Response<any> = await controller[methodName](input);

      response.status(code).send(body);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).send({ error: error.issues });
        return;
      }

      // eslint-disable-next-line no-console
      console.log(error);
      response.status(500).send({ error: 'Internal Server Error!' });
    }
  };
}
