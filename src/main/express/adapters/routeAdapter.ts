import { RequestHandler } from 'express';
import { ZodError } from 'zod';

import { getSchema } from '../../../kernel/decorators/Schema';
import { Response } from '../../../shared/types/Response';
import { parseRequest } from '../helpers/parseRequest';

export function expressRouteAdapter(
  controller: any,
  methodName: string,
): RequestHandler {
  const prototype = Object.getPrototypeOf(controller);

  const schema = getSchema(prototype, methodName);

  return async (request, response) => {
    try {
      // Faz parse da request, se houver schema
      const input = schema ? parseRequest(request, schema) : request;

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
